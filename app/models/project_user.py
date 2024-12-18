from .db import db
from datetime import datetime


class ProjectUser(db.Model):
    __tablename__ = "project_users"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer, db.ForeignKey("projects.id"), nullable=False
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )

    # Relationships
    project = db.relationship("Project", back_populates="project_users")
    user = db.relationship("User", back_populates="project_users")

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "user_id": self.user_id
        }