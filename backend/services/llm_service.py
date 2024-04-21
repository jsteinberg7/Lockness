from json import parse_json
import os
from file_dictionary import file_dict
import pandas as pd
from dotenv import load_dotenv
import cohere


class LLMService:
    
    initial_prompt, clarifications, table_data, column_data, english_breakdown, previous_code = None, None, None, None, None, None



    load_dotenv()
    COHERE_SECRET_KEY = os.getenv('COHERE_SECRET_KEY') # ENSURE THIS IS SET IN YOUR .env FILE

    @staticmethod
    def stream_llm_response(prompt):
        co = cohere.Client(LLMService.COHERE_SECRET_KEY)

        response = co.chat(message=prompt)
        
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

        yield response.text
            # if event.event_type == "text-generation":
            #     print(event.text)
            #     yield event.text
            # elif event.event_type == "stream-end":
            #     print(event.finish_reason)





    @staticmethod
    def run_clarification_questions_prompt(prompt):
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way:
        {prompt}
        {open('./clarifying_prompt.txt', 'r').read().strip()}

        This is an example of how to format the clarifications:

        Here are some clarification questions I would ask to better understand the query:

        1. What specific information are you looking to extract from the database?
        2. Are there any time constraints or specific date ranges for the data required?
        3. Do you have any preference for the output format or structure of the final results?
        """

        for chunk in LLMService.stream_llm_response(full_prompt):
            yield chunk

    # Generates a plain English outline of how to approach the query described in prompt
    @staticmethod
    def run_english_overview_prompt(prompt):
        # Segment to find relevant tables
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way: {LLMService.initial_prompt}
        Here are some clarifications to the query: {LLMService.clarifications} \n
        What tables/files would be relevant for this query? Return the recommended table names in a JSON list WITH NO EXPLANATION!
        Here is a list of tables/files and their descriptions:\n
        """
        for table in file_dict:
            full_prompt += f"{table['tablename']} : {table['desc']}"

        full_prompt += f"""Please return the table names in the following JSON format WITHOUT EXPLANATION: [\n\t\"tablename1\",\n\t\"tablename2\",\n\t\"tablename3\",\n\t ...\n]"""

        res = None # call llm
        table_res = parse_json(str(res))

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
            df_temp = pd.read_csv("./Excel_Files/" + root  + fname.replace("/"," and ") + ".csv")

            # get the first column as a list
            list1 = df_temp[df_temp.columns.to_list()[0]].to_list()
            # get the Labels column as a list
            list2 = df_temp["Label"].to_list()
            # get types column as a list
            list3 = df_temp["Type"].to_list()
            table_payload += "\n".join([f"{list1[i]}: {list2[i]}, {list3[i]}" for i in range(len(list1))]) + "\n"
        
        full_prompt = f"""The user wants to run a query on vrdc ccw that is described in the following way: {LLMService.initial_prompt}\n
        Here are some clarifications to the query: {LLMService.clarifications} \n
        The following is a list of relevant tables with their descriptions and columns. I want you to return a JSON Object WITHOUT EXPLANATION that is a dictionary of the table names and the correspond to a list of STRICTLY just the columns that are relevant to the query, and has the following format: \n {{\n\t\"tablename1\":[\n\t\t\"relevant_column_1\",\n\t\t\"relevant_column_2\"\n\t]\n, \n\t\"tablename2\":[\n\t\t\"relevant_column_1\",\n\t\t\"relevant_column_2\"\n\t]\n....\}}\n
        HERE ARE THE TABLES AND THEIR COLUMNS: {table_payload}"""

        res = None # call llm
        column_res = parse_json(str(res))
        
        tbl_paylod2 = ""
        for i in column_res:
            tbl_paylod2 += "Table "+i + " has columns: " + ", ".join(column_res[i]) + "\n"

        full_prompt += f"""The user wants to run a query on vrdc ccw that is described in the following way: 
        \n{LLMService.initial_prompt}. \n
        Here are some clarifications to the query: {LLMService.clarifications} \n
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

        for chunk in LLMService.stream_llm_response(full_prompt):
            result += chunk
            yield chunk

        LLMService.english_breakdown = result

    # Generates an SQL query based on the outline generated in the previous step
    @staticmethod
    def run_code_step_generation_prompt(english_outline, step, prev_code=None):
        full_prompt = f"""Generate the SQL query code, only for step {step} based on the following outline. 
        You may use the entire outline for context, but only generate code for the specified step.
        Also include a brief bulleted explanation of the code you generated.
        
        Task outline:
        {english_outline}

        Already generated code, which you need to add on to (do not repeat already generated code):
        {prev_code}

        Wrap all SQL query code in ~~~~sql ~~~~ to format it as SQL code, readable in Markdown, following the example format below:

        Example:
        Alright! Let's move on to step {step}: Filter for Dialysis Services
        ~~~~sql
        WHERE service_id IN (SELECT service_id FROM services WHERE service_type = 'Dialysis')
        ~~~~
        ##### Explanation
        - I have sorted and aggregated the data in order to access the correct tables and functions
        - Identified and impored the correct columns necessaet such as...
        """

        for chunk in LLMService.stream_llm_response(full_prompt):
            yield chunk
    
    @staticmethod
    def run_query_combination_prompt(english_outline, prev_code):
        full_prompt = f"""
        Combine all of the code to accomplish the task described in the outline:
        Also include a brief bulleted explanation of the code you generated.
        
        Task outline:
        {english_outline}

        Generated code to combine:
        {prev_code}

        Wrap all SQL query code in ~~~~sql ~~~~ to format it as SQL code, readable in Markdown, following the example format below:

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

        for chunk in LLMService.stream_llm_response(full_prompt):
            yield chunk
        
        
    @staticmethod
    def run_prompt(input, msg_type, step, prev_code=None):
        if msg_type == "clarification":
            initial_prompt = input
            chunks = LLMService.run_clarification_questions_prompt(input)
        elif msg_type == "englishOutline":
            # at this point the input is the clarifications the user provides from the previous llm call
            clarifications = input
            chunks = LLMService.run_english_overview_prompt(input)
        elif msg_type == "codeStep":
            chunks = LLMService.run_code_step_generation_prompt(input, step, prev_code) # note: "prompt" should be the english outline here
        elif msg_type == "finalCode":
            chunks = LLMService.run_query_combination_prompt(input, prev_code) # note: "prompt" should be the english outline here
        else: 
            raise ValueError("Invalid message type")
        
        for chunk in chunks:
            yield chunk
