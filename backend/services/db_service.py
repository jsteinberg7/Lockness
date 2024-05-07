import os
import uuid
from datetime import datetime, timezone

from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Text, create_engine)
from sqlalchemy.orm import relationship, scoped_session, sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class Session(Base):
    __tablename__ = 'sessions'
    session_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    messages = relationship("Message", order_by="Message.sent_at", back_populates="session")
    column_data = Column(Text, nullable=True)

class Message(Base):
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True)
    session_id = Column(String, ForeignKey('sessions.session_id'))
    session = relationship("Session", back_populates="messages")
    text = Column(Text, nullable=False)
    requested_msg_type = Column(String, nullable=False)
    is_system = Column(Boolean, nullable=False, default=True)
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "message_id": self.message_id,
            "session_id": self.session_id,
            "text": self.text,
            "requested_msg_type": self.requested_msg_type,
            "is_system": self.is_system,
            "sent_at": self.sent_at.isoformat() if self.sent_at else None
        }

class DbService:
    def __init__(self):
        db_url = os.getenv("DATABASE_URL") if os.getenv("DATABASE_URL") else f'postgresql://postgres:{os.getenv("DB_PASS")}@localhost/lockness' 
        self._engine = create_engine(db_url)
        self._session_factory = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self._engine))
        # if tables are not created, create them
        self.create_tables()

    def create_tables(self):
        Base.metadata.create_all(self._engine)

    def get_db_session(self):
        return self._session_factory()

    def create_session(self, session_id=None):
        db_session = self.get_db_session()
        new_session = Session()

        # If a session_id is provided, set it, otherwise rely on default database behavior
        if session_id is not None:
            new_session.session_id = session_id

        db_session.add(new_session)
        db_session.commit()
        db_session.refresh(new_session)
        db_session.close()
        return new_session
    
    def set_session_column_data(self, session_id, column_data):
        db_session = self.get_db_session()
        session = db_session.query(Session).filter(Session.session_id == session_id).first()
        session.column_data = column_data
        db_session.commit()
        db_session.refresh(session)
        db_session.close()
        return session

    def create_message(self, session_id, text, requested_msg_type, is_system=True):
        db_session = self.get_db_session()
        message = Message(session_id=session_id, text=text, requested_msg_type=requested_msg_type, is_system=is_system)
        db_session.add(message)
        db_session.commit()
        db_session.refresh(message)
        db_session.close()
        return message

    def get_messages(self, session_id):
        db_session = self.get_db_session()
        # Querying and ordering messages by 'sent_at' in descending order (newest first)
        messages = db_session.query(Message).filter(Message.session_id == session_id).order_by(Message.sent_at.asc()).all()
        db_session.close()
        return messages

    def get_session(self, session_id):
        db_session = self.get_db_session()
        session = db_session.query(Session).filter(Session.session_id == session_id).first()
        db_session.close()
        return session