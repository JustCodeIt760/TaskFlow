from  .db import db
from .user import User
from .project import Project
from .task import Task






class Feature(db.Model):
    __tablename__ = 'features'

    # Production Setup
    # Basic Field
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey('projects.id'),
        nullable=False)
    name = db.Column(
        db.String,
        nullable=False)

    position = db.Column(db.Integer, nullable=False)

    created_by = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False)

    sprint_id = db.Column(
        db.Integer,
        db.ForeignKey('sprints.id'),
        nullable=True)
    #TimeStamps
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
        )

    def to_dict(self):
        return  {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'position': self.position,
            'created_by': self.created_by,
            'sprint_id': self.sprint_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class Project(db.Model):
    __tablename__= 'projects'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('features.id'))

    features = db.relationship('Feature', back_populates='project')

class User(db.Model):
    __tablename__='users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('features.created_by.User_id'))

    features = db.relationship('Feature', back_populates='user')

class Sprint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sprint_id = db.Column(db.Integer, db.ForeignKey('features.sprint_id'))

    features = db.relationship('Feature', back_populates='sprint')

@app.routes('/projects/<int:project_id>/features')

#get all features for a project
def get_features():
    features = Feature.query.filter_by(project_id=project_id).all()
    if features:
        return jsonify([feature.to_dict() for feature in features])
    else:
        return jsonify({'error': 'No features found for this project'})

#get a single feature
def get_feature(feature_id):
    feature = Feature.query.get(feature_id)
    if feature:
        return jsonify(feature.to_dict())
    else:
        return jsonify({ 'error':'Feature not found'})
    

#create a new feature for a project
def create_feature(project_id):
    if not request.json:
        return jsonify({'error': 'Invalid request'}), 400
    data = request.get_json()
    try:
        new_feature = Feature(
            project_id=project_id,
            name=data['name'],
            position=data['position'],
            created_by=data['created_by'],
            sprint_id=data['sprint_id']
        )
        db.session.add(new_feature)
        db.session.commit()
        return jsonify(new_feature.to_dict()), 201
    except:
        return jsonify({'error': 'Failed to create feature'}), 500