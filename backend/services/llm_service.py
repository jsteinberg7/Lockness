import json
import os
import requests
from dotenv import load_dotenv
from groq import Groq

class LLMService:
    
    load_dotenv()
    GROQ_SECRET_KEY = os.getenv('GROQ_SECRET_KEY')


    # Generates a plain English overview of how to approach the query described in prompt
    def wrap_natural_language_prompt(prompt):
        return f"""Generate a plain English overview of how to approach the query described in the following prompt:\n{prompt}. 
        Do not include any additional output besides the Markdown content.
        Output the content/code in CommonMark Markdown format, divided into steps, following the example format below:
        
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
    
    # Generates an SQL query based on the overview generated in the previous step
    @staticmethod
    def wrap_query_generation_prompt(english_overview):
        return f"""Generate an SQL query based on the following prompt.
        Wrap the query in ~~~~sql ~~~~ to format it as SQL code, readable in Markdown.
        Do not include any additional output besides the SQL query and the Markdown formatting.
        {english_overview}

        Example:
        ~~~~sql
        SELECT amount_spent, date_of_service, state
        FROM transactions
        WHERE service_id IN (SELECT service_id FROM services WHERE service_type = 'Dialysis')
        AND date_of_service BETWEEN '2021-01-01' AND '2021-12-31'
        AND state = 'NY';
        ~~~~
        """

    @staticmethod
    def stream_llm_response(prompt, step):
        if step == "overview":
            prompt = LLMService.wrap_natural_language_prompt(prompt)
        elif step == "code":
            prompt = LLMService.wrap_query_generation_prompt(prompt) # pass in the English overview as the prompt

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