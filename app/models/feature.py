from .db import db
from flask import Blueprint, jsonify, request, render_template, Flask
from datetime import datetime


feature_routes = Blueprint('features', __name__)

class Feature(db.Model):
    __tablename__ = 'features'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    position = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sprint_id = db.Column(db.Integer, db.ForeignKey('sprints.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    project = db.relationship('Project', back_populates='features')
    user = db.relationship('User', back_populates='features')
    sprint = db.relationship('Sprint', back_populates='features')

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'position': self.position,
            'created_by': self.created_by,
            'sprint_id': self.sprint_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@feature_routes.route('/projects/<int:project_id>/features', methods=['GET'])
# get all features for a project
def get_features(project_id):
    features = Feature.query.filter_by(project_id=project_id).all()
    return jsonify([feature.to_dict() for feature in features]) if features else jsonify({'error': 'No features found for this project'})

# get a single feature by feature_id
@feature_routes.route('/features/<int:feature_id>', methods=['GET'])
def get_feature(feature_id):
    feature = Feature.query.get(feature_id)
    return jsonify(feature.to_dict()) if feature else jsonify({'error': 'Feature not found'})

# create a new feature
@feature_routes.route('/projects/<int:project_id>/features', methods=['POST'])
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
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to create feature'}), 500

# get all features
@feature_routes.route('/features', methods=['GET'])
def show_all_features():
    features = Feature.query.all()
    return render_template('show_all.html', features=features)

# get a single feature
@feature_routes.route('/features/<int:feature_id>/details', methods=['GET'])
def get_feature_by_id(feature_id):
    if not feature_id:
        return jsonify({'error': 'Invalid feature ID'}), 400

    feature = Feature.query.get(feature_id)
    if feature:
        return render_template('feature.html', feature=feature)
    return jsonify({'error': 'Feature not found'}), 404