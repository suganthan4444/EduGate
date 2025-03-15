from django.contrib.auth.backends import BaseBackend
from .models import Learner, Educator, SuperAdmin
from django.http import HttpRequest

class LearnerBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        print(f"Authenticating email: {email}")
        print(f"Received password: {password}")

        try:
            learner = Learner.objects.get(email=email)
            if learner.check_password(password):
                print("Password is correct")
                print(f"{learner}")
                return learner
                
        except Learner.DoesNotExist:
            print("No Learner Exists")
            return None

    def get_user(self, user_learner_id):
        try:
            return Learner.objects.get(pk=user_learner_id)
        except Learner.DoesNotExist:
            return None

class EducatorBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        print(f"Authenticating email: {email}")
        print(f"Received password: {password}")

        try:
            educator = Educator.objects.get(email=email)
            if educator.check_password(password):
                print("Password is correct")
                print(f"{educator}")
                return educator
                
        except Educator.DoesNotExist:
            print("No Educator Exists")
            return None

    def get_user(self, user_educator_id):
        try:
            return Educator.objects.get(pk=user_educator_id)
        except Educator.DoesNotExist:
            return None
        
class SuperAdminBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        print(f"Authenticating email: {email}")
        print(f"Received password: {password}")

        try:
            admin = SuperAdmin.objects.get(email=email)
            if admin.check_password(password):
                print("Password is correct")
                print(f"{admin}")
                return admin
                
        except SuperAdmin.DoesNotExist:
            print("No Admin Exists")
            return None

    def get_user(self, user_id):
        try:
            return SuperAdmin.objects.get(pk=user_id)
        except SuperAdmin.DoesNotExist:
            return None