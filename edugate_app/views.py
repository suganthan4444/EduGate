from django.shortcuts import render
from django.http import JsonResponse
from .models import ReleasedCourses

def get_released_courses(request):
    try:
        courses = ReleasedCourses.objects.all()
        categorized_courses = {}
        
        for course in courses:
            if course.course_domain not in categorized_courses:
                categorized_courses[course.course_domain] = [course]
            else:
                categorized_courses[course.course_domain].append(course)

        # Convert queryset to dictionary for easy serialization
        serialized_courses = {
            domain: [
                {
                    'course_id': course.course_id,
                    'course_name': course.course_name,
                    'educator_id': course.educator_id,
                    'educator_name': course.educator_name,
                    'course_thumbnail_url': course.course_thumbnail_url,
                    'course_price': course.course_price
                } for course in courses
            ] for domain, courses in categorized_courses.items()
        }

        return JsonResponse(serialized_courses, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)