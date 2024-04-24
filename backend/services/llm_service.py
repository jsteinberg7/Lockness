import json
import os
from services.file_dictionary import file_dict
import pandas as pd
from dotenv import load_dotenv
import cohere


class LLMService:
    
    initial_prompt, clarifications, column_data, english_outline, previous_code = None, None, None, None, None


    load_dotenv()
    COHERE_SECRET_KEY = os.getenv('COHERE_SECRET_KEY') # ENSURE THIS IS SET IN YOUR .env FILE

    system_prompt = open("services/system_explain_vrdc_ccw.txt", "r").read().strip()
    json_system_prompt = open("services/json_system_prompt.txt", "r").read().strip()
    co = cohere.Client(COHERE_SECRET_KEY)
    
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
        response = LLMService.co.chat(message=full_prompt)
        
        # for event in co.chat(message=prompt
        #     # messages=[
        #     #     {
        #     #         "role": "system",
        #     #         "content": "You are a helpful assistant.",
        #     #     },
        #     #     {
        #     #         "role": "user", 
        #     #         "content": prompt,
        #     #     }
        #     # ],
        #     # model="command-xlarge-20221108"
        # ):
        print(response.text)
        yield response.text
            # if event.event_type == "text-generation":
            #     print(event.text)
            #     yield event.text
            # elif event.event_type == "stream-end":
            #     print(event.finish_reason)


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
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way:
        {self.initial_prompt}
        {open('services/clarifying_prompt.txt', 'r').read().strip()}

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
            df_temp = pd.read_csv("services/Excel_Files/" + root  + fname.replace("/"," and ") + ".csv")

            # get the first column as a list
            list1 = df_temp[df_temp.columns.to_list()[0]].to_list()
            # get the Labels column as a list
            list2 = df_temp["Label"].to_list()
            # get types column as a list
            list3 = df_temp["Type"].to_list()
            table_payload += "\n".join([f"{list1[i]}: {list2[i]}, {list3[i]}" for i in range(len(list1))]) + "\n"
        
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way: {self.initial_prompt}\n
        Here are some clarifications to the query: {self.clarifications} \n
        The following is a list of relevant tables with their descriptions and columns. I want you to return a JSON Object WITHOUT EXPLANATION that is a dictionary of the table names and the correspond to a list of STRICTLY just the columns that are relevant to the query, and has the following format: \n {{\n\t\"tablename1\":[\n\t\t\"relevant_column_1\",\n\t\t\"relevant_column_2\"\n\t]\n, \n\t\"tablename2\":[\n\t\t\"relevant_column_1\",\n\t\t\"relevant_column_2\"\n\t]\n....\}}\n
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

        MUST WRAP all SQL query code in ~~~~sql ~~~~ to format it as SQL code, readable in Markdown, following the example format below:

        Example:
        Alright! Let's move on to step {step}: Filter for Dialysis Services
        ~~~~sql
        WHERE service_id IN (SELECT service_id FROM services WHERE service_type = 'Dialysis')
        ~~~~
        ##### Explanation
        - I have sorted and aggregated the data in order to access the correct tables and functions
        - Identified and impored the correct columns necessaet such as...
        """
        result = ""
        for chunk in LLMService.stream_prompt(full_prompt):
            result += chunk
            yield chunk
        self.previous_code = "" if self.previous_code is None else self.previous_code

        split_result = result.split("~~~~sql")[1].split("~~~~")[0].strip()
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

        MUST wrap all SQL query code in ~~~~sql ~~~~ to format it as SQL code, readable in Markdown, following the example format below:

        Example:
        Alright! Here's the full query:
        ~~~~sql
        SELECT * FROM transactions
        JOIN patients ON transactions.patient_id = patients.patient_id
        JOIN services ON transactions.service_id = services.service_id
        WHERE services.service_type = 'Dialysis'
        ~~~~
        ##### Explanation
        - I have sorted and aggregated the data in order to access the correct tables and functions
        """

        # final_result = LLMService.prompt(full_prompt)

        # # extract the sql code from the final result
        # split_result = final_result.split("~~~~sql")[1].split("~~~~")[0].strip()
        # full_query = self.previous_code + split_result
        # # pass full code to linter
        # linting_result = LintingService.lint_sql(full_query)
        # # append linting results to the final result
        # final_result += "\n\nLinting Results:\n"
        # if len(linting_result) == 0:
        #     final_result += "No linting errors or warnings found."
        # else:
        #     for violation in linting_result:
        #         final_result += f"Line {violation.line_no}: {violation.description}\n"
        
        for chunk in LLMService.stream_prompt(full_prompt):
            yield chunk
        
        
    def run_prompt(self, input, msg_type, step):
        if msg_type == "clarification":
            self.initial_prompt = input
            chunks = self.run_clarification_questions_prompt()
        elif msg_type == "englishOutline":
            # at this point the input is the clarifications the user provides from the previous llm call
            self.clarifications = input
            chunks = self.run_english_overview_prompt()
        elif msg_type == "codeStep":
            chunks = self.run_code_step_generation_prompt(step) # note: "prompt" should be the english outline here
        elif msg_type == "finalCode":
            chunks = self.run_query_combination_prompt() # note: "prompt" should be the english outline here
        else: 
            raise ValueError("Invalid message type")
        
        for chunk in chunks:
            yield chunk
