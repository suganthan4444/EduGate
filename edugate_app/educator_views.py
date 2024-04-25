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
from django.urls import reverse
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.core.exceptions import ValidationError
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


logger = logging.getLogger(__name__)
@csrf_exempt
def fetch_educator_session_data(request):
    """Fetch session data including OTP and email."""
    # Retrieve OTP and email from session data
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')

    # Return the data as JSON
    return Response({
        'otp': stored_otp,
        'email': stored_email,
    }, status=status.HTTP_200_OK)
@csrf_exempt
def educator_view_function(request):
    # Retrieve the session data
    stored_otp = request.session.get('otp')
    stored_email = request.session.get('email')

    # Log the session data using print()
    print(f"Stored OTP: {stored_otp}, Stored Email: {stored_email}")

    # Alternatively, use logger.debug() if you prefer to log using a logger
    logger.debug(f"Stored OTP: {stored_otp}, Stored Email: {stored_email}")

    # ... rest of your view logic

    return JsonResponse({"message": "Session data logged"})
@csrf_exempt
def educator_generate_and_send_otp(email):
    """Generate and send an OTP to the given email address."""
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
        # If the request method is not POST, return an error response
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
        
        # Both email and mobile_no are unique
        return JsonResponse({
            "success": True,
            "message": ""
        })

    else:
        return JsonResponse({
            "success": False,
            "message": "Invalid request method. Only POST is allowed."
        }, status=405)  # Method Not Allowed

@csrf_exempt
@api_view(['POST'])
def educator_send_otp(request):
    """Send OTP to the provided email address."""
    email = request.data.get("email")

    if not email:
        return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Generate and send OTP
    otp = educator_generate_and_send_otp(email)

    if otp:
        # Store OTP and email in session
        request.session['otp'] = otp  # Convert OTP to string for consistency
        request.session['email'] = email
        request.session.save()

        # Log the session data
        logger.debug(f"Session data saved: OTP={request.session['otp']}, email={request.session['email']}")
        

        return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@csrf_exempt
@api_view(['POST'])
def educator_verify_otp(request):
    email = request.data.get('email')
    otp_input = request.data.get('otp')  

    # Check for missing email or OTP
    if email is None or otp_input is None:
        return Response({"message": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
        
    logger.debug(f"Retrieved OTP and email from cookie: OTP={otp_input}, email={email}")

    # Retrieve stored OTP and email from session
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
    
    # Continue with verification
    stored_otp_str = str(stored_otp)
    otp_input_str = str(otp_input)

    if stored_email == email and otp_input_str == stored_otp_str:
        # Clear session data after successful verification
        response = JsonResponse({"success": True, "message": "OTP verified successfully."}, status=status.HTTP_200_OK)

        
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"

        return response
    else:
        return Response({"message": "Invalid email or OTP."}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def educator_signup(request):
    """Handle learner signup and OTP verification."""
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

        # Authenticate the learner using the specified backend
        try:
           backend = EducatorBackend()
           educator = backend.authenticate(request, email=email, password=password)
        
           if educator is not None:
            # Login successful, log the learner in
                login(request, educator, backend='edugate_djangoapp.backends.EducatorBackend')

                return JsonResponse({
                   "success": True,
                   "message": "Login successful",
                   "educator_id": educator.id
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
def educator_space(request, educator_id):
    try:
        educator = Educator.objects.get(id=educator_id)
        
        # Retrieve the courses purchased by the learner (assuming there is a relationship)
        courses = educator.courses.all()  # This line depends on how you model the relationship
        
        # Render a template with the learner's profile data and courses
        return render(request, '/educator_space/', {
            'educator': educator,
            'courses': courses,
        })
    except Educator.DoesNotExist:
        # Handle case where the learner does not exist
        return JsonResponse({"success": False, "message": "Educator does not exist."})
@csrf_exempt    
@api_view(['GET'])
def educator_profile(request):
    # Check if the request.user is authenticated
    if request.user.is_authenticated:
        try:
            # Retrieve the learner using the logged-in user's ID
            educator = Educator.objects.get(id=request.user.id)
            
            # Prepare the learner's data to be returned in the response
            data = {
                'name': educator.name,
                'dob': educator.dob,
                'email': educator.email,  # Use 'email_id' instead of 'email'
                'mobile_no': educator.mobile_no,
                'highest_qualification': educator.highest_qualification,
                'username': educator.username,
            }
            
            # Return the learner's data as a JSON response
            return JsonResponse(data, status=200)
        except Educator.DoesNotExist:
            # Handle the case where the learner does not exist
            return JsonResponse({'error': 'Educator not found'}, status=404)
    
    # If the user is not authenticated, return an error response
    return JsonResponse({'error': 'User not authenticated'}, status=401)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def educator_courses(request, educator_id):
    if request.user.is_authenticated:
     try:
        courses = EducatorCourses.objects.filter(educator_id=educator_id)
        data = [{
            'id': course.id,
            'course_name': course.course_name,
            'course_thumbnail': course.course_thumbnail.url,
            'price': course.course_price,
        } for course in courses]
        return JsonResponse(data, safe=False)
     except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'User not authenticated'}, status=401)