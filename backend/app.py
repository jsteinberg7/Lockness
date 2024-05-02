from gevent import monkey
monkey.patch_all()  # monkey patch before any other imports to avoid warnings

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from services.llm_service import LLMService
from dotenv import load_dotenv
import os
import base64

app = Flask(__name__)
CORS(
    app,
    resources={r"*": {"origins": "*", "allow_headers": "*"}},
    supports_credentials=True,
    automatic_options=True,
)

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent', logger=True, engineio_logger=True, max_http_buffer_size=1e8)
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
# @socketio.on("send_input")
# def handle_input(data, headers):
#     # note: "headers" is not used here, but we need the param to accept the api key as a header
#     input = data["input"]
#     msg_type = data["type"]
#     step = data.get("step", None)
#     file = data.get("file", None)
#     print(
#         f"Received input: {input}, msg_type: {msg_type}, step: {step}, file {file}"
#     )

#     session_id = request.sid

#     if session_id not in llm_services:
#         # Create a new LLMService instance for the new WebSocket connection
#         llm_services[session_id] = LLMService()
    
#     # Get the LLMService instance for the current WebSocket connection
#     llm_service = llm_services[session_id]

#     chunks = llm_service.run_prompt(input, msg_type, step)
#     for chunk in chunks:
#         emit(
#             "new_message",
#             {"text": chunk, "type": msg_type, "final": False},
#         )
#     emit(
#         "new_message",
#         {"text": "", "final": True, "type": msg_type}
#     )

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
    input = data.get("input")
    msg_type = data.get("type")
    step = data.get("step")
    file_data = data.get("fileData", None)
    file_name = data.get("fileName", None)
    file_type = data.get("fileType", None)

    print(f"Received input: {input}, msg_type: {msg_type}, step: {step}, file: {file_name}")

    # Check if there's a file data and handle it
    if file_data:
        # Assuming file_data is in ArrayBuffer format or similar binary format
        # Convert to bytes and save or process as needed
        try:
            # If the file data is coming in base64 encoded
            file_bytes = base64.b64decode(file_data)
            file_path = f"./uploadedDocuments/{file_name}"
            with open(file_path, 'wb') as f:
                f.write(file_bytes)
            print(f"File saved: {file_path}")
        except Exception as e:
            print(f"Error saving file: {e}")
    
    # Create or get an existing LLMService instance for the WebSocket session
    if session_id not in llm_services:
        llm_services[session_id] = LLMService()
    
    llm_service = llm_services[session_id]

    # Run prompt with input text, msg_type, and step
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