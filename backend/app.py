from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from services.llm_service import LLMService

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*", "allow_headers": "*"}},
     supports_credentials=True, automatic_options=True)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return jsonify(status="WebSocket server running")

# Flask-SocketIO backend example
@socketio.on('send_prompt')
# data params: 
# prompt
# step: "overview", "code"
def handle_prompt(data):
    print(f"Received prompt:, {data['prompt']} step = {data['step']}")
    responses = LLMService.stream_llm_response(data['prompt'], data['step'])
    for response in responses:
        emit('new_message', {'text': response, 'final': False})
    emit('new_message', {'text': '', 'final': True})  # Indicates the end of this stream


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
