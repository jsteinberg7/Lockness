import json
import os
import requests
from dotenv import load_dotenv
import anthropic


class LLMService:
    
    load_dotenv()
    CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
    CLAUDE_SECRET_KEY = os.environ.get("CLAUDE_SECRET_KEY")

    def wrap_initial_prompt(prompt):
        return f"""Generate code and/or content based on the following prompt:\n{prompt}. 
        Do not include any additional output, besides the code and/or content."""

    @staticmethod
    def stream_llm_response(prompt):

        prompt = LLMService.wrap_initial_prompt(prompt)

        client = anthropic.Anthropic(api_key=LLMService.CLAUDE_SECRET_KEY)
        
        with client.messages.stream(
            max_tokens=512,
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="claude-2.1",
        ) as stream:
            for text in stream.text_stream:
                yield text