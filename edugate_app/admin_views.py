from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from edugate_app.models import EducatorCourses, ReleasedCourses
from django.contrib.auth import login
from edugate_app.backends import SuperAdminBackend
from rest_framework.decorators import api_view

def admin_courses(request):
    courses = EducatorCourses.objects.all()
    data = [{
        'course_id': course.course_id,
        'course_name': course.course_name,
        'educator_id': course.educator_id,
        'educator_name': course.educator_name,
        'course_price': course.course_price,
        'course_release_status': course.course_release_status,
    } for course in courses]
    return JsonResponse(data, safe=False)

def release_course(request, course_id):
    course = get_object_or_404(EducatorCourses, course_id=course_id)
    course.course_release_status = 1
    course.save()
    return JsonResponse({'message': 'Course released successfully'})

def reject_course(request, course_id):
    course = get_object_or_404(EducatorCourses, course_id=course_id)
    return JsonResponse({'message': 'Course rejected successfully'})

def delete_course(request, course_id):
    course = get_object_or_404(EducatorCourses, course_id=course_id)
    return JsonResponse({'message': 'Course deleted successfully'})

@api_view(['POST'])
def admin_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        print(f'email={email}, pwd={password}')
        try:
           backend = SuperAdminBackend()
           admin = backend.authenticate(request, email=email, password=password)
        
           if admin is not None:
                login(request, admin, backend='edugate_djangoapp.backends.SuperAdminBackend')
                return JsonResponse({
                   "success": True,
                   "message": "Login successful",
                   "admin_name": admin.name,
            })
           else:
                print("Invalid email or password")
                return JsonResponse({"success": False, "message": "Invalid email or password."})
        except Exception as e:
           print("Password Authentication failed:", e)
           return JsonResponse({"success": False, "message": "Authentication failed."}, status=500)

@api_view(['POST'])        
def release_course(request, course_id):
    try:
        course = get_object_or_404(EducatorCourses, course_id=course_id)
        released_course = ReleasedCourses.objects.create(
            course_id=course.course_id,
            course_name=course.course_name,
            educator_id=course.educator_id,
            educator_name=course.educator_name,
            course_description=course.course_description,
            course_duration=course.course_duration,
            course_thumbnail_url=course.course_thumbnail.url,
            course_video_url=course.course_video.url,
            course_exercise_url=course.course_exercise_url,
            course_price=course.course_price
        )
        released_course.save()

        course.course_release_status = True
        course.save()

        return JsonResponse({'message': 'Course released successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)