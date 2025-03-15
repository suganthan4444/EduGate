from django.shortcuts import render
from django.http import JsonResponse
from .models import ReleasedCourses, Educator
from rest_framework.decorators import api_view


def get_released_courses(request):
    try:
        courses = ReleasedCourses.objects.all()
        categorized_courses = {}
        
        for course in courses:
            if course.course_domain not in categorized_courses:
                categorized_courses[course.course_domain] = [course]
            else:
                categorized_courses[course.course_domain].append(course)

        serialized_courses = {}
        for domain, courses in categorized_courses.items():
            serialized_courses[domain] = [
                {
                    'course_id': course.course_id,
                    'course_name': course.course_name,
                    'educator_id': course.educator_id,
                    'educator_name': course.educator_name,
                    'course_thumbnail_url': request.build_absolute_uri(course.course_thumbnail_url),
                    'course_price': course.course_price
                } for course in courses
            ]

        return JsonResponse(serialized_courses, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def course_preview(request, course_id):
    try:
        course = ReleasedCourses.objects.get(course_id=course_id)
        course_details = {
            'course_id': course.course_id,
            'course_name': course.course_name,
            'educator_id': course.educator_id,
            'educator_name': course.educator_name,
            'course_duration': course.course_duration,
            'course_description': course.course_description,
            'course_thumbnail_url': request.build_absolute_uri(course.course_thumbnail_url),
            'course_domain': course.course_domain,
            'course_price': course.course_price
        }
        return JsonResponse(course_details, status=200)
    except ReleasedCourses.DoesNotExist:
        return JsonResponse({'error': 'Course not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['GET'])
def educator_preview(request, educator_id):
    try:
        educator = Educator.objects.get(educator_id=educator_id)
        courses = ReleasedCourses.objects.filter(educator_id=educator_id)

        educator_data = {
            'name': educator.name,
            'profile_picture': request.build_absolute_uri(educator.profile_picture.url) if educator.profile_picture else None,
            'bio': educator.bio
        }

        courses_data = [{
            'course_id': course.course_id,
            'course_name': course.course_name,
            'educator_name': course.educator_name,
            'course_thumbnail_url': request.build_absolute_uri(course.course_thumbnail_url),
            'course_price': course.course_price
        } for course in courses]

        return JsonResponse({'educator': educator_data, 'courses': courses_data})
    except Educator.DoesNotExist:
        return JsonResponse({'error': 'Educator not found'}, status=404)
    
