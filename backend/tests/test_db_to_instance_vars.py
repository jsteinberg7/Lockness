import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from services.db_service import DbService
from services.llm_service import LLMService

# NOTE: The following tests are dependent on each other and should be run in order.

# create a session with the database
db_service = DbService()
session = db_service.create_session()


def test_get_session():
    s = db_service.get_session(session.session_id)
    assert s.session_id == session.session_id


def test_create_message():
    message = db_service.create_message(session.session_id, "Here is a clarification!", msg_type="clarification", is_system=False)
    assert message.session_id == session.session_id
    assert message.text == "Here is a clarification!"
    assert message.msg_type == "clarification"
    assert message.is_system == False

def test_get_messages():
    messages = db_service.get_messages(session.session_id)
    assert len(messages) == 1
    assert messages[0].session_id == session.session_id
    assert messages[0].text == "Here is a clarification!"
    assert messages[0].msg_type == "clarification"
    assert messages[0].is_system == False
    assert messages[0].sent_at is not None

def test_create_message2():
    message = db_service.create_message(session.session_id, "Here is an english outline! ...", msg_type="englishOutline", is_system=True)
    assert message.session_id == session.session_id
    assert message.text == "Here is an english outline! ..."
    assert message.msg_type == "englishOutline"
    assert message.is_system == True

def test_get_messages2():
    messages = db_service.get_messages(session.session_id)
    assert len(messages) == 2
    assert messages[1].session_id == session.session_id
    assert messages[1].text == "Here is an english outline! ..."
    assert messages[1].msg_type == "englishOutline"
    assert messages[1].is_system == True
    assert messages[1].sent_at is not None

def test_load_db_to_llm_service():
    llm_service = LLMService(session.session_id)
    assert llm_service.session_id == session.session_id
    assert llm_service.english_outline == "Here is an english outline! ..."
    assert llm_service.clarifications == "Here is a clarification!"

def test_add_full_conversation():
    test_messages = [
    {
        "text": "I would like to know how many people have died in Kansas in 2018 due to lung cancer.",
        "msg_type": "clarification", # yeah, this is confusing, but basically the msg_type for the user's input is the type of response we expect to get back
        "is_system": False
    },
    {
        "text": "1. What ICD-10 codes would you like to include?",
        "msg_type": "clarification",
        "is_system": True
    },
    {
        "text": "C34.0, C34.1, C34.2, C34.3, C34.8, C34.9",
        "msg_type": "englishOutline",
        "is_system": False
    },
    {
        "text": "Here is an english outline! ...",
        "msg_type": "englishOutline",
        "is_system": True
    },
    {
        "text": "Looks good!",
        "msg_type": "codeStep",
        "is_system": False
    },
    {
        "text": "~~~sql SELECT * FROM deaths ~~~",
        "msg_type": "codeStep",
        "is_system": True
    },
    {
        "text": "Looks good!",
        "msg_type": "codeStep",
        "is_system": False
    },
    {
        "text": "~~~sql WHERE state = 'Kansas' AND year = 2018 AND icd10_code IN ('C34.0', 'C34.1', 'C34.2', 'C34.3', 'C34.8', 'C34.9') ~~~",
        "msg_type": "codeStep",
        "is_system": True
    },
    {
        "text": "Looks good!",
        "msg_type": "codeStep",
        "is_system": False
    },
    {
        "text": "~~~sql SELECT * FROM deaths WHERE state = 'Kansas' AND year = 2018 AND icd10_code IN ('C34.0', 'C34.1', 'C34.2', 'C34.3', 'C34.8', 'C34.9') ~~~",
        "msg_type": "finalCode",
        "is_system": True
    }
]
    full_session = db_service.create_session()
    db_service.set_session_column_data(full_session.session_id, "C34.0, C34.1, C34.2, C34.3, C34.8, C34.9")
    for msg in test_messages:
        db_service.create_message(full_session.session_id, msg["text"], msg["msg_type"], msg["is_system"])
    llm_service = LLMService(full_session.session_id)
    assert llm_service.session_id == full_session.session_id
    assert llm_service.column_data == "C34.0, C34.1, C34.2, C34.3, C34.8, C34.9"
    assert llm_service.initial_prompt == test_messages[0]["text"]
    assert llm_service.clarifications == test_messages[2]["text"]
    assert llm_service.english_outline == test_messages[3]["text"]
    assert llm_service.previous_code == LLMService.extract_sql_code(test_messages[5]["text"]) + "\n" + LLMService.extract_sql_code(test_messages[7]["text"])
    assert llm_service.final_code == LLMService.extract_sql_code(test_messages[9]["text"])
    