import uuid
from datetime import datetime, timezone

from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Text, create_engine)
from sqlalchemy.orm import relationship, scoped_session, sessionmaker, declarative_base

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
    msg_type = Column(String, nullable=False)
    is_system = Column(Boolean, nullable=False, default=True)
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DbService:
    def __init__(self):
        db_url = 'postgresql://postgres:lockness123@localhost/lockness'
        self._engine = create_engine(db_url)
        self._session_factory = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self._engine))
        # if tables are not created, create them
        self.create_tables()

    def create_tables(self):
        Base.metadata.create_all(self._engine)

    def get_db_session(self):
        return self._session_factory()

    def create_session(self):
        db_session = self.get_db_session()
        new_session = Session()
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

    def create_message(self, session_id, text, msg_type, is_system=True):
        db_session = self.get_db_session()
        message = Message(session_id=session_id, text=text, msg_type=msg_type, is_system=is_system)
        db_session.add(message)
        db_session.commit()
        db_session.refresh(message)
        db_session.close()
        return message

    def get_messages(self, session_id):
        db_session = self.get_db_session()
        messages = db_session.query(Message).filter(Message.session_id == session_id).order_by(Message.sent_at).all()
        db_session.close()
        return messages

    def get_session(self, session_id):
        db_session = self.get_db_session()
        session = db_session.query(Session).filter(Session.session_id == session_id).first()
        db_session.close()
        return session