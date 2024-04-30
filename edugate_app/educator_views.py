#djangoproject/edugate_app/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
import random
from django.db.models import Q
from edugate_app.models import Educator
from .serializers import EducatorSerializer
import logging
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.core.exceptions import ValidationError
from django.views.decorators.clickjacking import xframe_options_deny
from edugate_app.validators import CustomPasswordValidator
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .models import EducatorCourses
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import validate_email
from django.core.validators import validate_integer
from django.contrib.auth import login, authenticate
from django.contrib.auth.hashers import check_password, make_password
from edugate_app.backends import EducatorBackend
from django.contrib.auth.backends import BaseBackend, ModelBackend
from django.shortcuts import get_object_or_404


logger = logging.getLogger(__name__)

@csrf_exempt
def fetch_educator_session_data(request):
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')
    return Response({
        'otp': stored_otp,
        'email': stored_email,
    }, status=status.HTTP_200_OK)

@csrf_exempt
def educator_view_function(request):
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')
    print(f"Stored OTP: {stored_otp}, Stored Email: {stored_email}")
    logger.debug(f"Stored OTP: {stored_otp}, Stored Email: {stored_email}")
    return JsonResponse({"message": "Session data logged"})

@csrf_exempt
def educator_generate_and_send_otp(email):
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
def check_educator_username_availability(request):
    if request.method == 'POST':
        username = request.data.get('username')
        is_username_taken = Educator.objects.filter(Q(username=username)).exists()
        print(f"Requested username={username}")
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


@csrf_exempt
def check_educator_unique_fields(request):
    if request.method == 'POST':
        email = request.data.get('email')
        mobile_no = request.data.get('mobile_no')
        logger.debug(f"Stored Email: {email}, Stored Mobile No: {mobile_no}")

        email_exists = Educator.objects.filter(email=email).exists()
        mobile_no_exists = Educator.objects.filter(mobile_no=mobile_no).exists()

        if email_exists:
            return JsonResponse({
                "success": False,
                "message": "Email is already in use. Please choose another email."
            })

        if mobile_no_exists:
            return JsonResponse({
                "success": False,
                "message": "Mobile No is already in use. Please choose another Mobile No."
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
def educator_send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    otp = educator_generate_and_send_otp(email)

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
def educator_verify_otp(request):
    email = request.data.get('email')
    otp_input = request.data.get('otp')  

    if email is None or otp_input is None:
        return Response({"message": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
        
    logger.debug(f"Retrieved OTP and email from cookie: OTP={otp_input}, email={email}")

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
def educator_signup(request):
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
    serializer = EducatorSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        request.session.pop('otp', None)
        request.session.pop('email', None)
        
        return Response({"success":True, "message": "Verification successful. Learner signed up."}, status=status.HTTP_201_CREATED)
    else:

        error_messages = serializer.errors
        return Response({"message": "Invalid data provided.", "errors": error_messages}, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to the Home Page!"}, status=status.HTTP_200_OK)

def educator_view_function(request):
    response = HttpResponse("Setting a cookie")
    response.set_cookie("cookie_name", "cookie_value")
    return response

def get_educator_csrf_token(request):
    csrf_token = request.session.get('csrf_token', '')
    return JsonResponse({'csrfToken': csrf_token})


@api_view(['POST'])
def educator_login(request):
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
           backend = EducatorBackend()
           educator = backend.authenticate(request, email=email, password=password)
        
           if educator is not None:
                login(request, educator, backend='edugate_djangoapp.backends.EducatorBackend')
                return JsonResponse({
                   "success": True,
                   "message": "Login successful",
                   "educator_id": educator.educator_id,
                   "educator_name": educator.name,
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
   
@login_required
def educator_space(request, educator_id):
    try:
        educator = Educator.objects.get(educator_id=educator_id)
        
        courses = educator.courses.all()
        return render(request, '/educator_space/', {
            'educator': educator,
            'courses': courses,
        })
    except Educator.DoesNotExist:
        return JsonResponse({"success": False, "message": "Educator does not exist."})

@login_required
@csrf_exempt    
@api_view(['GET'])
def educator_profile(request):
    try:
        educator_id = request.GET['educatorId']
        print(f'{educator_id}')
        educator = Educator.objects.get(educator_id=educator_id)
        
        data = {
            'name': educator.name,
            'dob': educator.dob,
            'email': educator.email,
            'mobile_no': educator.mobile_no,
            'highest_qualification': educator.highest_qualification,
            'username': educator.username,
        }
        return JsonResponse(data, status=200)
    except Educator.DoesNotExist:
        print('Educator not')
        return JsonResponse({'error': 'Educator not found'}, status=404)
        
@login_required
@csrf_exempt
@api_view(['GET'])
def educator_courses(request):
     try:
        educator_id = request.GET.get('educatorId')
        courses = EducatorCourses.objects.filter(educator_id=educator_id)
        data = [{
            'course_id': course.course_id,
            'course_name': course.course_name,
            'course_thumbnail': request.build_absolute_uri(course.course_thumbnail.url),
            'course_price': course.course_price,
        } for course in courses]
        return JsonResponse(data, safe=False)
     except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def add_educator_courses(request):
    if request.method == 'POST':
        educator_name = request.POST.get('educatorName')
        educator_id = request.POST.get('educatorId')
        course_name = request.POST.get('courseName')
        course_description = request.POST.get('courseDescription')
        course_duration = request.POST.get('courseDuration')
        course_thumbnail = request.FILES.get('courseThumbnail')
        course_price = request.POST.get('coursePrice')
        course_video = request.FILES.get('videoFile')
        course_exercise_url = request.POST.get('exerciseURL')

        educator_course = EducatorCourses(
            educator_name=educator_name,
            educator_id=educator_id,
            course_name=course_name,
            course_description=course_description,
            course_duration=course_duration,
            course_thumbnail=course_thumbnail,
            course_video=course_video,
            course_price = course_price,
            course_exercise_url=course_exercise_url,
        )
        educator_course.save()
        return JsonResponse({'message': 'Course added successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    
@login_required
def educator_course_inlook(request, course_id):
    course = get_object_or_404(EducatorCourses, course_id=course_id)
    data = {
        'course_id': course.course_id,
        'course_name': course.course_name,
        'course_thumbnail': request.build_absolute_uri(course.course_thumbnail.url),
        'educator_name': course.educator_name,
        'course_duration': course.course_duration,
        'course_description': course.course_description,
        'course_video': request.build_absolute_uri(course.course_video.url),
        'course_exercise': course.course_exercise_url,
    }
    return JsonResponse(data)