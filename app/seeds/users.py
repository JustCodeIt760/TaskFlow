from models import db, User
from sqlalchemy.sql import text


def seed_users():
    demo = User(
        username="Demo",
        email="demo@aa.io",
        password="password",
        first_name="Demo",
        last_name="User",
    )
    sarah = User(
        username="sarah",
        email="sarah@aa.io",
        password="password",
        first_name="Sarah",
        last_name="Smith",
    )
    mike = User(
        username="mike",
        email="mike@aa.io",
        password="password",
        first_name="Mike",
        last_name="Johnson",
    )

    db.session.add_all([demo, sarah, mike])
    db.session.commit()
    return [demo, sarah, mike]  # Return for use in other seeds


def undo_users():
    db.session.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE;"))
    db.session.commit()