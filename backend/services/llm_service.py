import json
import os

import cohere
import pandas as pd
from dotenv import load_dotenv
from services.file_dictionary import file_dict
from services.linting_service import LintingService
from services.db_service import DbService


class LLMService:
    
    initial_prompt, clarifications, column_data, english_outline, previous_code, final_code = None, None, None, None, None, None

    load_dotenv()
    COHERE_SECRET_KEY = os.getenv('COHERE_SECRET_KEY') # ENSURE THIS IS SET IN YOUR .env FILE

    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    system_prompt = open(os.path.join(root_dir, "services", "system_explain_vrdc_ccw.txt"), "r").read().strip()
    json_system_prompt = open(os.path.join(root_dir, "services", "json_system_prompt.txt"), "r").read().strip()
    co = cohere.Client(COHERE_SECRET_KEY)

    def __init__(self, session_id=None):

        if not session_id: # if no session_id is provided, we can skip loading in the session data
            return

        self.session_id = session_id
        self.db_service = DbService()
        # check if there is a session in db matching the session_id
        session = self.db_service.get_session(session_id)
        if session is None: # if no session exists with the id, create a new session in the db with the session_id
            # if there isn't, create a new session in the db with the session_id
            session = self.db_service.create_session(session_id)
        else: # if there session exists in db, load the session data into the instance variables
            self.column_data = session.column_data
            messages = self.db_service.get_messages(session_id)
            if messages is not None:
                # load the messages into the instance variables
                for message in messages:
                    if message.is_system:
                        if message.requested_msg_type == "englishOutline":
                            self.english_outline = message.text
                        elif message.requested_msg_type == "codeStep":
                            self.previous_code = "" if self.previous_code is None else self.previous_code
                            self.previous_code += LLMService.extract_sql_code(message.text) + "\n"
                        elif message.requested_msg_type == "finalCode":
                            self.final_code = LLMService.extract_sql_code(message.text)
                    else: # if the message is not a system message, it is a user message
                        if message.requested_msg_type == "clarification":
                            self.initial_prompt = message.text
                        elif message.requested_msg_type == "englishOutline":
                            self.clarifications = message.text
                    
                            
    @staticmethod
    def extract_sql_code(result):
        return result.split("~~~sql")[1].split("~~~")[0].strip()
    
    @staticmethod
    def parse_json(json_str):
        try:
            s = json_str.split("JSONSTARTSHERE")[-1]
            return json.loads(s.strip())
        except json.JSONDecodeError as e:
            return None

    @staticmethod
    def stream_prompt(prompt):
        
        full_prompt = LLMService.system_prompt + prompt

        for response in LLMService.co.chat_stream(message=full_prompt):
            if response.event_type == "text-generation":
                # print(response.text)
                yield response.text
            elif response.event_type == "stream-end":
                # print(response.finish_reason)
                break



    @staticmethod
    def prompt(prompt, json_output=False, model_used="command-r-plus") -> str:
        messages = []

        message = LLMService.system_prompt + "\n" + LLMService.json_system_prompt if json_output else LLMService.system_prompt

        messages.append({
            "role": "SYSTEM",
            "message": message,
        })


        chat_completion = LLMService.co.chat(
            chat_history=messages,
            message = prompt,
            model=model_used,
        )
        print(chat_completion.text)
        return chat_completion.text

    
    def run_clarification_questions_prompt(self):
        clarifying_prompt = open(os.path.join(LLMService.root_dir, "services", "clarifying_prompt.txt"), "r").read().strip()
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way:
        {self.initial_prompt}
        {clarifying_prompt}

        This is an example of how to format your response. Do not include any addition output after the clarification questions.

        Here are some clarification questions I would like you to answer to help me better understand the query:

        1. What specific information are you looking to extract from the database?
        2. Are there any time constraints or specific date ranges for the data required?
        3. Do you have any preference for the output format or structure of the final results?
        """

        for chunk in LLMService.stream_prompt(full_prompt):
            yield chunk

    # Generates a plain English outline of how to approach the query described in prompt
    
    def run_english_overview_prompt(self):
        # Segment to find relevant tables
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way: {self.initial_prompt}
        Here are some clarifications to the query: {self.clarifications} \n
        What tables/files would be relevant for this query? Return the recommended table names in a JSON list WITH NO EXPLANATION!
        Here is a list of tables/files and their descriptions:\n
        """
        for table in file_dict:
            full_prompt += f"{table['tablename']} : {table['desc']}"

        full_prompt += f"""Please return the table names in the following JSON format WITHOUT EXPLANATION: [\n\t\"tablename1\",\n\t\"tablename2\",\n\t\"tablename3\",\n\t ...\n]"""

        print("OH LOOKEY HERE")
        print(full_prompt)
        res = LLMService.prompt(full_prompt, json_output=True) # call llm (will return json)
        table_res = LLMService.parse_json(str(res))

        # Segment to find relevant columns

        table_payload = ""
        tbls = [i for i in file_dict if i["tablename"] in table_res]
        for i in tbls:
            table_payload += i["tablename"] + ": " + i["desc"] + "\n"
            table_payload += f"HERE ARE THE COLUMNS FOR THE TABLE {i['tablename']}. They follow the format <column_name>: <description>, <type> :"
            root = i["file-root"]
            fname = ""
            if i["sub-sections"] is not None:
                fname = i["sub-sections"][0]
            df_temp = pd.read_csv(os.path.join(LLMService.root_dir, "services", "Excel_Files", root + fname.replace("/", " and ") + ".csv"))

            # get the first column as a list
            list1 = df_temp[df_temp.columns.to_list()[0]].to_list()
            # get the Labels column as a list
            list2 = df_temp["Label"].to_list()
            # get types column as a list
            list3 = df_temp["Type"].to_list()
            table_payload += "\n".join([f"{list1[i]}: {list2[i]}, {list3[i]}" for i in range(len(list1))]) + "\n"

        
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way: {self.initial_prompt}\n
        Here are some clarifications to the query: {self.clarifications} \n
        The following is a list of relevant tables with their descriptions and columns. 
        I want you to return a JSON Object WITHOUT EXPLANATION that is a dictionary of the table names and the correspond to a list of STRICTLY just the columns that are relevant to the query, and has the following format:
        \n {{\n\t\"tablename1\":[\n\t\t\"relevant_column_1\",\n\t\t\"relevant_column_2\"\n\t]\n, \n\t\"tablename2\":[\n\t\t\"relevant_column_1\",\n\t\t\"relevant_column_2\"\n\t]\n....\}}\n
        HERE ARE THE TABLES AND THEIR COLUMNS: {table_payload}"""

        res = LLMService.prompt(full_prompt, json_output=True) # call llm (return json)
        column_res = self.parse_json(str(res))
        
        tbl_paylod2 = ""
        for i in column_res:
            tbl_paylod2 += "Table "+i + " has columns: " + ", ".join(column_res[i]) + "\n"


        # Section to generate the English breakdown
        full_prompt += f"""The user wants to run a query on vrdc ccw that is described in the following way: 
        \n{self.initial_prompt}. \n
        Here are some clarifications to the query: {self.clarifications} \n
        Here is a list of relevant tables/files with their descriptions and columns: {tbl_paylod2} \n
        
        Generate a plain English outline of how to approach the query. Note that you do not have to use ALL tables provided, make a judgement on what you think is needed for the query.
        
        Output the content/code in CommonMark Markdown format, divided into steps, using h5 for step headers. Do not use any Markdown headers besides h5 (#####) for step headers.
        
        Do not include any additional output besides the Markdown content.
        Additionally, you do not need to include a final "combination" step, as this is implied by the outline itself.

        Note that you do not need to use an arbitrary number of steps; use as many as necessary to break down the query effectively, but don't simple tasks into many steps just for the sake of it.

        Follow the format used in the example below. Note that the example is not a real query, but just a template to show the expected format.
    
        Great question! Let me create an outline of the steps I am going to take in order to resolve this query and you can let me know if everything looks good!

        ##### Step 1: Identify and Select Relevant Tables and Columns

        - Choose the appropriate tables that contain the billing information for medical procedures. Typically, this might include tables like transactions, patients, services, etc.

        - Identify necessary columns such as `amount_spent`, `date_of_service`, `state`, `service_id`, and any patient identifiers linking to Medicaid.

        ##### Step 2: Filter for Dialysis Services

        - Apply filters to the selected tables and columns to only include rows related to dialysis services.

        - Use service codes, descriptions, or other identifiers specific to dialysis to accurately capture the relevant data.

        ##### Step 3: Set Date Range and Location Filters

        - Determine the desired date range for the analysis and filter the data to only include rows within that time period.

        - If looking at data for a specific geographic region, filter the data based on `state`, `zip_code`, or other location identifiers.
        """
        result = ""

        for chunk in LLMService.stream_prompt(full_prompt):
            result += chunk
            yield chunk

        self.english_outline = result

    # Generates an SQL query based on the outline generated in the previous step
    
    def run_code_step_generation_prompt(self, step):
        full_prompt = f"""Generate the SQL query code, only for step {step} based on the following outline. 
        You may use the entire outline for context, but only generate code for the specified step.
        Also include a brief bulleted explanation of the code you generated.
        
        Task outline:
        {self.english_outline}

        Already generated code, which you need to add on to (do not repeat already generated code):
        {self.previous_code}

        MUST WRAP all SQL query code in ~~~sql ~~~ to format it as SQL code, readable in Markdown, following the example format below. Note the example is only to show the format, and does not contain relevant data to the query.

        Example:
        Alright! Let's move on to step {step}: Filter for Dialysis Services
        ~~~sql
        WHERE service_id IN (SELECT service_id FROM services WHERE service_type = 'Dialysis')
        ~~~
        ##### Explanation
        - I have sorted and aggregated the data in order to access the correct tables and functions
        - Identified and impored the correct columns necessaet such as...
        """
        result = ""
        for chunk in LLMService.stream_prompt(full_prompt):
            result += chunk
            yield chunk
        self.previous_code = "" if self.previous_code is None else self.previous_code

        split_result = LLMService.extract_sql_code(result)
        self.previous_code += split_result + "\n"

    
    def run_query_combination_prompt(self):
        full_prompt = f"""
        The user wants to run a query on vrdc ccw that is described in the following way: 
        {self.initial_prompt}\n
        Here are some clarifications to the query: {self.clarifications} \n
        Here is a list of relevant tables/files with their descriptions and columns: {self.column_data} \n
        Combine all of the code to accomplish the task described in the outline:
        Also include a brief bulleted explanation of the code you generated.
        
        Task outline:
        {self.english_outline}

        Previously Generated code to combine:
        {self.previous_code}

        MUST wrap all SQL query code in ~~~sql ~~~ to format it as SQL code, readable in Markdown, ensure the generated code will pass a linter. Follow the example format below.

        Example:
        Alright! Here's the full query:
        ~~~sql
        SELECT * FROM transactions
        JOIN patients ON transactions.patient_id = patients.patient_id
        JOIN services ON transactions.service_id = services.service_id
        WHERE services.service_type = 'Dialysis'
        ~~~
        ##### Explanation
        - I have sorted and aggregated the data in order to access the correct tables and functions
        """

        final_result = LLMService.prompt(full_prompt)

        # extract the sql code from the final result
        full_query = LLMService.extract_sql_code(final_result)
        # pass full code to linter
        violations, errors = LintingService.lint_sql(full_query)
        # append linting results to the final result
        
        num_fix_attempts = 0
        while len(errors) > 0 and num_fix_attempts < 3:
        # If errors are found, prompt the LLM to fix the errors
            fix_prompt = full_prompt + f"""This is the code previously generated for the above orignal prompt:
{full_query}

The query has been linted and the following are the results:
{errors}

Please regenerate the query, following the original prompt and format and fixing the above errors.
"""
            print("Errors found, attempting to fix...")
            final_result = LLMService.prompt(fix_prompt)
            full_query = LLMService.extract_sql_code(final_result)
            violations, errors = LintingService.lint_sql(full_query)
            num_fix_attempts += 1

        
        if len(errors) == 0:
            final_result += "\n\n*Code successfully parsed for syntax errors ✅*"
        else:
            final_result += "\n\nThe linter found the following errors, which were unable to be fixed:\n"
            for error in errors:
                final_result += f"{error}\n"

        yield final_result
        
        
    def run_prompt(self, input, requested_msg_type, step):
        # add message to the database for the session
        self.db_service.create_message(self.session_id, input, requested_msg_type, False)
        if requested_msg_type == "clarification":
            self.initial_prompt = input
            chunks = self.run_clarification_questions_prompt()
        elif requested_msg_type == "englishOutline":
            # at this point the input is the clarifications the user provides from the previous llm call
            self.clarifications = input
            chunks = self.run_english_overview_prompt()
        elif requested_msg_type == "codeStep":
            chunks = self.run_code_step_generation_prompt(step) # note: "prompt" should be the english outline here
        elif requested_msg_type == "finalCode":
            chunks = self.run_query_combination_prompt() # note: "prompt" should be the english outline here
        else: 
            raise ValueError("Invalid message type")
        
        for chunk in chunks:
            yield chunk
