from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from services.llm_service import LLMService

app = Flask(__name__)
CORS(
    app,
    resources={r"*": {"origins": "*", "allow_headers": "*"}},
    supports_credentials=True,
    automatic_options=True,
)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index():
    return jsonify(status="WebSocket server running")


# Flask-SocketIO backend example
@socketio.on("send_prompt")
def handle_prompt(data):
    prompt = data["prompt"]
    msg_type = data["type"]
    step = data.get("step", None)
    prev_code = data.get("prev_code", None)

    print(
        f"Received prompt: {prompt}, msg_type: {msg_type}, step: {step}, prev_code: {prev_code}"
    )

    chunks = LLMService.run_prompt(prompt, msg_type, step, prev_code)
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
    )  # Indicates the end of this stream


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5001)
