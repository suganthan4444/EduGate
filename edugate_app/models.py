from django.db import models
from django.db.models import CASCADE
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin, Group, Permission
import random
import string
from django.utils import timezone

def generate_unique_id(length=15):
    numeric = string.digits  # Only digits for random numbers
    return ''.join(random.choices(numeric, k=length))


class SuperAdminManager(BaseUserManager):
    def create_superuser(self, email, name, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        if not name:
            raise ValueError('The Name field must be set')
        
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            is_superuser=True,
            is_staff=True,
            last_login=timezone.now()
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

class SuperAdmin(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = SuperAdminManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def save(self, *args, **kwargs):
        if self.password.startswith('raw_'):
            self.password = make_password(self.password.replace('raw_', '', 1))
        super(SuperAdmin, self).save(*args, **kwargs)

    def check_password(self, raw_password):
        if self.password.startswith('raw_'):
            return self.password == 'raw_' + raw_password
        return check_password(raw_password, self.password)

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    def __str__(self):
        return self.email



class Learner(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, unique=True)
    mobile_no = models.CharField(max_length=15, unique=True)
    dob = models.DateField()
    highest_qualification = models.CharField(max_length=100)
    learner_id = models.BigIntegerField( unique=True, primary_key=True, verbose_name='ID')
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='learner_profile_pictures/', null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name='learner_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='learner_set', blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.learner_id:
            self.learner_id = generate_unique_id()
        super().save(*args, **kwargs)
    
class Educator(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255, verbose_name='Full Name')
    educator_id = models.BigIntegerField( unique=True, primary_key=True, verbose_name='ID')
    dob = models.DateField(verbose_name='Date of Birth')
    highest_qualification = models.CharField(max_length=100, verbose_name='Highest Qualification')
    email = models.EmailField(unique=True, verbose_name='Email Address')
    mobile_no = models.CharField(max_length=15, unique=True, verbose_name='Mobile Number')
    username = models.CharField(max_length=50, unique=True, verbose_name='Username')
    password = models.CharField(max_length=255, verbose_name='Password')
    bio = models.TextField(blank=True, verbose_name='Biography')
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name='Date Joined')
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name='educator_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='educator_set', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.educator_id:
            self.educator_id = generate_unique_id()
        super().save(*args, **kwargs)

class EducatorCourses(models.Model):
    educator_name = models.CharField(max_length=255)
    educator_id = models.BigIntegerField(max_length=100)
    course_id = models.BigIntegerField( unique=True)
    course_name = models.CharField(max_length=100)
    course_description = models.TextField()
    course_duration = models.TextField()
    course_domain = models.TextField(null=True)
    course_thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    course_video_id = models.BigIntegerField( unique=True)
    course_video = models.FileField(upload_to='course_videos/')
    course_exercise_id = models.BigIntegerField( unique=True)
    course_exercise_url = models.TextField()
    course_price = models.TextField(null=True)
    course_release_status = models.BooleanField(default=False)
    course_rejection_reason = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.educator_name} - {self.course_name}"

    def save(self, *args, **kwargs):
        if not self.course_id:
            self.course_id = generate_unique_id()
        if not self.course_video_id:
            self.course_video_id = generate_unique_id()
        if not self.course_exercise_id:
            self.course_exercise_id = generate_unique_id()
        super().save(*args, **kwargs)


class LearnerCourses(models.Model):
    learner_id = models.BigIntegerField(max_length=100)
    learner_name = models.CharField(max_length=255)
    course_id = models.BigIntegerField(max_length=15)
    course_name = models.CharField(max_length=100)
    educator_id = models.BigIntegerField(max_length=100)
    educator_name = models.CharField(max_length=255)
    course_description = models.TextField()
    course_duration = models.DurationField()
    course_domain = models.TextField(null=True)
    course_thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    course_video_id = models.BigIntegerField(max_length=15)
    course_video = models.TextField() 
    course_exercise_id = models.BigIntegerField(max_length=15)
    course_exercise = models.TextField() 
    course_completion_status = models.BooleanField(default=False)
    course_certificate = models.FileField(upload_to='course_certificates/', null=True, blank=True)

    def __str__(self):
        return f"{self.learner_name} - {self.course_name}"

class ReleasedCourses(models.Model):
    course_id = models.BigIntegerField(unique=True)
    course_name = models.CharField(max_length=100)
    educator_id = models.BigIntegerField()
    educator_name = models.CharField(max_length=255)
    course_description = models.TextField()
    course_duration = models.CharField(max_length=100)
    course_domain = models.TextField(null=True)
    course_thumbnail_url = models.URLField()
    course_video_url = models.URLField()
    course_exercise_url = models.URLField()
    course_price = models.CharField(max_length=100)