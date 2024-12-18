from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'  # Change this to your database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Feature(db.Model):
    __tablename__ = 'features'

    id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    project_id = db.Column(db.BigInteger, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    position = db.Column(db.BigInteger, nullable=False)
    created_by = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    sprint_id = db.Column(db.BigInteger, db.ForeignKey('sprints.id'), nullable=True)

    project = db.relationship('Project', backref='features')
    created_by_user = db.relationship('User ', backref='created_features', foreign_keys=[created_by])
    sprint = db.relationship('Sprint', backref='features', foreign_keys=[sprint_id])

    def __repr__(self):
        return f'<Feature {self.name}>'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
