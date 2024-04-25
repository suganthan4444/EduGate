#djangoproject/edugate_app/serializers.py
from rest_framework import serializers
from .models import Learner
from .models import Educator

class LearnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learner
        exclude = ['learner_id']

class EducatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Educator
        fields = '__all__'