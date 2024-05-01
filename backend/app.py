from gevent import monkey
monkey.patch_all()  # monkey patch before any other imports to avoid warnings

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from services.llm_service import LLMService
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(
    app,
    resources={r"*": {"origins": "*", "allow_headers": "*"}},
    supports_credentials=True,
    automatic_options=True,
)

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')
socketio.init_app(app, cors_allowed_origins="*")

load_dotenv()

@app.before_request
def require_api_key():
    if request.method == 'OPTIONS':
        return  # Allow CORS preflight requests to pass
    if request.headers.get('Authorization') != os.getenv('BACKEND_API_KEY'):
        abort(401, 'Invalid API key')

@app.route("/")
def index():
    return jsonify(status="WebSocket server running")

llm_services = {str: LLMService()} # track LLMService instances for each WebSocket connection, mapping s

# Flask-SocketIO backend example
@socketio.on("send_input")
def handle_input(data, headers=None):
    # note: "headers" is not used here, but we need the param to accept the api key as a header    
    input = data["input"]
    msg_type = data["type"]
    step = data.get("step", None)
    print(
        f"Received input: {input}, msg_type: {msg_type}, step: {step}"
    )

    session_id = request.sid

    if session_id not in llm_services:
        # Create a new LLMService instance for the new WebSocket connection
        llm_services[session_id] = LLMService()
    
    # Get the LLMService instance for the current WebSocket connection
    llm_service = llm_services[session_id]

    chunks = llm_service.run_prompt(input, msg_type, step)
    for chunk in chunks:
        emit(
            "new_message",
            {"text": chunk, "type": msg_type, "final": False, "step": step},
        )
    emit(
        "new_message",
        {"text": "", "final": True, "type": msg_type, "step": step},
    )

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5001)