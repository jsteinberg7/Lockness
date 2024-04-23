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
socketio = SocketIO(app, cors_allowed_origins="*")

load_dotenv()

@app.before_request
def require_api_key():
    if request.method == 'OPTIONS':
        return # Allow CORS preflight requests to pass
    if request.headers.get('Authorization') != os.getenv('BACKEND_API_KEY'):
        abort(401, 'Invalid API key')


@app.route("/")
def index():
    return jsonify(status="WebSocket server running")


# Flask-SocketIO backend example
@socketio.on("send_input")
def handle_input(data, headers): # note: "headers" is not used here, but we need the param to accept the api key as a header
    input = data["input"]
    msg_type = data["type"]
    step = data.get("step", None)
    prev_code = data.get("prev_code", None)

    print(
        f"Received input: {input}, msg_type: {msg_type}, step: {step}, prev_code: {prev_code}"
    )

    chunks = LLMService.run_prompt(input, msg_type, step)
    for chunk in chunks:
        emit(
            "new_message",
            {
                "text": chunk,
                "type": msg_type,
                "final": False,
            },
        )
    emit(
        "new_message", {"text": "", "final": True, "type": msg_type}
    )


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5001)
