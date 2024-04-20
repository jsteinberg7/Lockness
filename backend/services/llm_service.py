import json
import os
import requests
from dotenv import load_dotenv
from groq import Groq

class LLMService:
    
    load_dotenv()
    GROQ_SECRET_KEY = os.getenv('GROQ_SECRET_KEY')


    # Generates a plain English outline of how to approach the query described in prompt
    def wrap_natural_language_prompt(prompt):
        return f"""Generate a plain English outline (or ask for clarifications) of how to approach the query described in the following prompt:\n{prompt}. 
        Do not include any additional output besides the Markdown content.
        If generating the outline, output the content/code in CommonMark Markdown format, divided into steps, using h5 for step headers. Do not use any Markdown headers besides h5 (#####) for step headers.
        Additionally, you do not need to include a final "combination" step, as this is implied by the outline itself.

        If you need any clarifications or further context to generate the outline, please ask questions in the form of a bulleted list. In this case, do not generate an outline.

        If you have all the information you need and you are ready to generate the outline, please proceed with the outline generation. 
        following the example format below.
        Note that you do not need to use an arbitrary number of steps; use as many as necessary to break down the query effectively, but don't simple tasks into many steps just for the sake of it.
    
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
    
    # Generates an SQL query based on the outline generated in the previous step
    @staticmethod
    def wrap_query_generation_prompt(english_outline, step, prev_code=None):
        return f"""Generate the SQL query code, only for step {step} based on the following outline. 
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
    
    @staticmethod
    def wrap_query_combination_prompt(english_outline, prev_code):
        return f"""
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


    @staticmethod
    def stream_llm_response(prompt, msg_type, step, prev_code=None):
        print(msg_type)
        if msg_type == "englishOutline": # outline step
            prompt = LLMService.wrap_natural_language_prompt(prompt)
        elif msg_type == "codeStep": # code generation step
            prompt = LLMService.wrap_query_generation_prompt(prompt, step, prev_code) # pass in the English outline as the prompt
        elif msg_type == "finalCode":
            prompt = LLMService.wrap_query_combination_prompt(prompt, prev_code) # pass in the English outline as the prompt
        else:
            raise ValueError("Invalid step value. Step must be 0 or greater.")

        client = Groq(api_key=LLMService.GROQ_SECRET_KEY)

        with client.chat.completions.with_streaming_response.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            model="llama3-70b-8192",
        ) as response:
            for line in response.iter_lines():
                if line:
                    json_data = json.loads(line)
                    if "choices" in json_data:
                        for choice in json_data["choices"]:
                            if "message" in choice and "content" in choice["message"]:
                                print(choice["message"]["content"])
                                yield choice["message"]["content"]