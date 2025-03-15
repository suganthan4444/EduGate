#djangoproject/edugate_app/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
import random
from django.db.models import Q
from edugate_app.models import Learner, ReleasedCourses, LearnerCourses
from .serializers import LearnerSerializer
import logging
from django.urls import reverse
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.core.exceptions import ValidationError
from edugate_app.validators import CustomPasswordValidator
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .models import LearnerCourses
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import validate_email
from django.core.validators import validate_integer
from django.contrib.auth import login, authenticate
from django.contrib.auth.hashers import check_password, make_password
from edugate_app.backends import LearnerBackend
from django.contrib.auth.backends import BaseBackend, ModelBackend
import json
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)
@csrf_exempt
def fetch_learner_session_data(request):
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')
    return Response({
        'otp': stored_otp,
        'email': stored_email,
    }, status=status.HTTP_200_OK)

@csrf_exempt
def learner_view_function(request):
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')
    print(f"Stored OTP: {stored_otp}, Stored Email: {stored_email}")
    logger.debug(f"Stored OTP: {stored_otp}, Stored Email: {stored_email}")
    return JsonResponse({"message": "Session data logged"})

@csrf_exempt
def learner_generate_and_send_otp(email):
    otp = random.randint(100000, 999999)
    subject = "Your OTP"
    message = f"Your OTP is: {otp}"
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return otp
    except Exception as e:
        logger.exception(f"Failed to send OTP email to {email}: {e}")
        return None

@csrf_exempt
@api_view(['POST'])
def check_learner_username_availability(request):
    if request.method == 'POST':
        username = request.data.get('username')
        is_username_taken = Learner.objects.filter(Q(username=username)).exists()
        if is_username_taken:
            print("Username is taken")
            return JsonResponse({
                "username": {
                    "is_unique": False,
                    "message": "Username is already taken. Please choose another username."
                }
            }, status=200)
            
        else:
            return JsonResponse({
                "username": {
                    "is_unique": True,
                    "message": "Username is available."
                }
            }, status=200)
    else:
        return JsonResponse({
            "success": False,
            "message": "Invalid request method. Only POST is allowed."
        }, status=400)

@api_view(['POST'])
@csrf_exempt
def check_learner_unique_fields(request):
    if request.method == 'POST':
        email = request.data.get('email')
        logger.debug(f"User input email: {email}")

        email_exists = Learner.objects.filter(email__iexact=email).exists()

        if email_exists:
            print('Email is already in use')
            return JsonResponse({
                "success": False,
                "message": "Email is already in use. Please choose another email."
            })

        return JsonResponse({
            "success": True,
            "message": ""
        })

    else:
        return JsonResponse({
            "success": False,
            "message": "Invalid request method. Only POST is allowed."
        }, status=405) 

@csrf_exempt
@api_view(['POST'])
def learner_send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    otp = learner_generate_and_send_otp(email)

    if otp:
        request.session['otp'] = otp 
        request.session['email'] = email
        request.session.save()
        logger.debug(f"Session data saved: OTP={request.session['otp']}, email={request.session['email']}")     
        return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@csrf_exempt
@api_view(['POST'])
def learner_verify_otp(request):
    email = request.data.get('email')
    otp_input = request.data.get('otp')  

    if email is None or otp_input is None:
        return Response({"message": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
        
    logger.debug(f"Retrieved OTP and email from user input: OTP={otp_input}, email={email}")

    try:
       stored_otp = request.session.get('otp')
       stored_email = request.session.get('email')
    except Exception as e:
       logger.exception(f"Error retrieving session data: {e}")

    logger.debug(f"Retrieved OTP and email from session: OTP={stored_otp}, email={stored_email}")
    logger.debug(f"Request session ID: {request.session.session_key}")

    if  stored_otp is None:
        return Response({"message": "No OTP found in session"}, status=status.HTTP_400_BAD_REQUEST)
    if stored_email is None :
        return Response({"message": "No email found in session."}, status=status.HTTP_400_BAD_REQUEST)

    stored_otp_str = str(stored_otp)
    otp_input_str = str(otp_input)

    if stored_email == email and otp_input_str == stored_otp_str:
        response = JsonResponse({"success": True, "message": "OTP verified successfully."}, status=status.HTTP_200_OK)       
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"

        return response
    else:
        return Response({"message": "Invalid email or OTP."}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def learner_signup(request):
    email = request.data.get('email')
    otp_input = request.data.get('otp')
    
    if email is None or otp_input is None:
        return Response({"message": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')

    logger.debug(f"Retrieved OTP and email from session: OTP={stored_otp}, email={stored_email}")
    
    if stored_email != email or int(otp_input) != stored_otp:
        return Response({"message": "Invalid OTP or email."}, status=status.HTTP_400_BAD_REQUEST)

    raw_password = request.data.get('password')

    if raw_password is None:
        return Response({"message": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

    hashed_password = make_password(raw_password)
    
    data = request.data.copy()
    data['password'] = hashed_password
    serializer = LearnerSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        request.session.pop('otp', None)
        request.session.pop('email', None)
        
        return Response({"success":True, "message": "Verification successful. Learner signed up."}, status=status.HTTP_201_CREATED)
    else:

        error_messages = serializer.errors
        return Response({"message": "Invalid data provided.", "errors": error_messages}, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt    
@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Home Page!"}, status=status.HTTP_200_OK)

def learner_view_function(request):
    response = HttpResponse("Setting a cookie")
    response.set_cookie("cookie_name", "cookie_value")
    return response

def get_learner_csrf_token(request):
    csrf_token = request.session.get('csrf_token', '')
    return JsonResponse({'csrfToken': csrf_token})

@csrf_exempt
@api_view(['POST'])
def learner_login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        validator = CustomPasswordValidator()
        
        try:
            validator.validate(password)
            print("Password validation successful")
        except ValidationError as e:
            print("Password validation failed:", str(e))
            return JsonResponse({"success": False, "message": str(e)})

        try:
           backend = LearnerBackend()
           learner = backend.authenticate(request, email=email, password=password)
        
           if learner is not None:
                login(request, learner, backend='edugate_djangoapp.backends.LearnerBackend')

                return JsonResponse({
                   "success": True,
                   "message": "Login successful",
                   "learner_id": learner.learner_id
            })
           else:
                print("Invalid email or password")
                return JsonResponse({"success": False, "message": "Invalid email or password."})
        except Exception as e:
           print("Password Authentication failed:", e)
           return JsonResponse({"success": False, "message": "Authentication failed."}, status=500)

    else:
        print("Invalid request method")
        return JsonResponse({"success": False, "message": "Invalid request method."})
    
@csrf_exempt    
@login_required
def learner_space(request, learner_id):
    try:
        learner = Learner.objects.get(learner_id=learner_id)
        courses = learner.courses.all()
        return render(request, '/learner_space/', {
            'learner': learner,
            'courses': courses,
        })
    except Learner.DoesNotExist:
        return JsonResponse({"success": False, "message": "Learner does not exist."})
    
@csrf_exempt    
@api_view(['GET'])
def learner_profile(request):
    try:
        learner_id = request.GET['learnerId']
        print(f'{learner_id}')
        learner = Learner.objects.get(learner_id=learner_id)
        
        data = {
            'name': learner.name,
            'dob': learner.dob,
            'email': learner.email,
            'mobile_no': learner.mobile_no,
            'highest_qualification': learner.highest_qualification,
            'username': learner.username,
            'profile_picture': request.build_absolute_uri(learner.profile_picture),
        }
        return JsonResponse(data, status=200)
    except Learner.DoesNotExist:
        print('Learner not')
        return JsonResponse({'error': 'Learner not found'}, status=404)
        

def learner_courses(request, learner_id):
    try:
        learner_courses = LearnerCourses.objects.filter(learner_id=learner_id)
        data = [{
            'learner_id': course.learner_id,
            'learner_name': course.learner_name,
            'course_id': course.course_id,
            'course_name': course.course_name,
            'educator_id': course.educator_id,
            'educator_name': course.educator_name,
            'course_description': course.course_description,
            'course_duration': course.course_duration,
            'course_domain': course.course_domain,
            'course_thumbnail':course.course_thumbnail,
            'course_video_id': course.course_video_id,
            'course_video': course.course_video,
            'course_exercise_id': course.course_exercise_id,
            'course_purchase_status': course.course_purchase_status,
            'course_exercise_url': course.course_exercise_url
        } for course in learner_courses]
        return JsonResponse({'success': True, 'data': data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def enroll_course(request):
    if request.method == 'POST':
        data = request.data
        learner_id = data.get('learner_id')
        learner_name = data.get('learner_name')
        course_id = data.get('course_id')
        course_name = data.get('course_name')
        educator_id = data.get('educator_id')
        educator_name = data.get('educator_name')
        course_description = data.get('course_description')
        course_duration = data.get('course_duration')
        course_domain = data.get('course_domain')
        course_thumbnail = data.get('course_thumbnail')
        course_video_id = data.get('course_video_id')
        course_video = data.get('course_video')
        course_exercise_id = data.get('course_exercise_id')
        course_exercise_url = data.get('course_exercise_url')
        course_purchase_status = data.get('course_purchase_status')
        print(f'{learner_id}{course_id}{educator_id}')


        LearnerCourses.objects.create(
            learner_id=learner_id,
            learner_name=learner_name,
            course_id=course_id,
            course_name=course_name,
            educator_id=educator_id,
            educator_name=educator_name,
            course_description=course_description,
            course_duration=course_duration,
            course_domain=course_domain,
            course_thumbnail=course_thumbnail,
            course_video_id=course_video_id,
            course_video=course_video,
            course_exercise_id=course_exercise_id,
            course_exercise_url=course_exercise_url,
            course_purchase_status=course_purchase_status
        )

        return JsonResponse({'message': 'Course enrollment successful'}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=405)
    
@csrf_exempt
def get_learner_name(request, learner_id):
    try:
        learner = Learner.objects.get(learner_id=learner_id)
        learner_name = learner.name
        return JsonResponse({'learner_name': learner_name}, status=200)
    except Learner.DoesNotExist:
        return JsonResponse({'error': 'Learner not found'}, status=404)
    
def get_course_details(request, course_id):
    if request.method == 'GET':
        course = get_object_or_404(ReleasedCourses, course_id=course_id)

        course_details = {
            'course_id': course.course_id,
            'course_name': course.course_name,
            'educator_id': course.educator_id,
            'educator_name': course.educator_name,
            'course_description': course.course_description,
            'course_duration': course.course_duration,
            'course_domain': course.course_domain,
            'course_thumbnail_url': request.build_absolute_uri(course.course_thumbnail_url),
            'course_video_url': request.build_absolute_uri(course.course_video_url),
            'course_exercise_url': course.course_exercise_url,
            'course_price': course.course_price
        }

        return JsonResponse(course_details)
    else:
        return JsonResponse({
            'error': 'Invalid request method. Only GET is allowed.'
        }, status=405)