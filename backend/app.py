import json
import time
from flask import Flask, Response, request
from services.llm_service import LLMService
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*", "allow_headers": "*"}}, supports_credentials=True, automatic_options=True)

@app.route('/chat', methods=['POST', 'GET'])
def chat():
    print("Connection opened")
    if request.method == 'POST':
        prompt = request.json['prompt']
        print("Received prompt:", prompt)
        return Response(generate_stream(prompt), mimetype='text/event-stream')
    elif request.method == 'GET':
        print("SSE initialized")
        return Response(generate_stream("", initialization=True), mimetype='text/event-stream')

def generate_stream(prompt, initialization=False):
    if initialization:
        while True:
            time.sleep(10)  # Adjust the timing as needed for your application
            print("Sending keep-alive")
            yield "event: message\ndata: {}\n\n".format(json.dumps({"text": "keep-alive"}))
    
    for text in LLMService.stream_llm_response(prompt):
        print("Sending message:", text)
        yield "event: message\ndata: {}\n\n".format(json.dumps({"text": text}))

if __name__ == '__main__':
    app.run(port=5001, debug=True)