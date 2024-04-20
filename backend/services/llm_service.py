import json
import os
import requests
from dotenv import load_dotenv
from groq import Groq

class LLMService:
    
    load_dotenv()
    CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
    GROQ_SECRET_KEY = os.getenv('GROQ_SECRET_KEY')

    def wrap_initial_prompt(prompt):
        return f"""Generate a plain English overview of how to approach the query described in the the following prompt:\n{prompt}. 
        Do not include any additional output besides the Markdown content.
        Output the content/code in CommonMark Markdown format, divided into steps, following the example format below:
        
        Great question! Let me create an outline of the steps I am going to take in order to resolve this query and you can let me know if everything looks good!

        ##### Step 1: Identify and Select Relevant Tables and Columns

        - Choose the appropriate tables that contain the billing information for medical procedures. Typically, this might include tables like transactions, patients, services, etc.

        - Identify necessary columns such as amount_spent, date_of_service, state, service_id, and any patient identifiers linking to Medicaid.

        ##### Step 2: Filter for Dialysis Services

        - Apply filters to the selected tables and columns to only include rows related to dialysis services.

        - Use service codes, descriptions, or other identifiers specific to dialysis to accurately capture the relevant data.

        ##### Step 3: Set Date Range and Location Filters

        - Determine the desired date range for the analysis and filter the data to only include rows within that time period.

        - If looking at data for a specific geographic region, filter the data based on state, zip code, or other location identifiers.
        """

    @staticmethod
    def stream_llm_response(prompt):
        prompt = LLMService.wrap_initial_prompt(prompt)

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