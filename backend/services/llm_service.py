import json
import os
import requests
from dotenv import load_dotenv
from groq import Groq

class LLMService:
    
    load_dotenv()
    GROQ_SECRET_KEY = os.getenv('GROQ_SECRET_KEY')

    @staticmethod
    def stream_llm_response(prompt):

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


    @staticmethod
    def run_clarification_questions_prompt(prompt):
        full_prompt = f"""Generate a list of clarification questions based on the following prompt:
        {prompt}
        Output the content in CommonMark Markdown format, using numbered list items for each question.
        Follow the format used in the example below. Note that the example is not a relevant list of questions, but just a template to show the expected format.
        You may ask as many questions as you think are necessary to clarify the prompt.
        
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
        full_prompt = f"""Generate a plain English outline of how to approach the query described in the following prompt:\n{prompt}. 
        Do not include any additional output besides the Markdown content.
        Output the content/code in CommonMark Markdown format, divided into steps, using h5 for step headers. Do not use any Markdown headers besides h5 (#####) for step headers.
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

        for chunk in LLMService.stream_llm_response(full_prompt):
            yield chunk

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
    def run_prompt(prompt, msg_type, step, prev_code=None):
        if msg_type == "clarification":
            chunks = LLMService.run_clarification_questions_prompt(prompt)
        elif msg_type == "englishOutline":
            chunks = LLMService.run_english_overview_prompt(prompt)
        elif msg_type == "codeStep":
            chunks = LLMService.run_code_step_generation_prompt(prompt, step, prev_code) # note: "prompt" should be the english outline here
        elif msg_type == "finalCode":
            chunks = LLMService.run_query_combination_prompt(prompt, prev_code) # note: "prompt" should be the english outline here
        else: 
            raise ValueError("Invalid message type")
        
        for chunk in chunks:
            yield chunk
