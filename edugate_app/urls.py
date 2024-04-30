#edugate_djangoapp/urls.py
from django.urls import path
from . import learner_views, educator_views, admin_views, views


urlpatterns = [
    path('api/get-released-courses/', views.get_released_courses, name='get_released_courses'),

    path('api/learner-send-otp/', learner_views.learner_send_otp, name='learner_send_otp'),
    path('api/learner-verify-otp/', learner_views.learner_verify_otp, name='learner_verify_otp'),
    path('api/learner-signup/', learner_views.learner_signup, name='learner_signup'),
    path('api/learner-login/', learner_views.learner_login, name='learner_login'),  
    path('api/learner-space/<int:learner_id>/', learner_views.learner_space, name='learner_space'),
    path('api/learner-profile/', learner_views.learner_profile, name='learner_profile'),
    path('api/learner-courses/<int:learner_id>/', learner_views.learner_courses, name='learner_courses'),
    path('', learner_views.home, name='home'),
    path('fetch-learner-session-data/', learner_views.fetch_learner_session_data, name='fetch_learner_session_data'),
    path('your-view/', learner_views.learner_view_function, name='learner_view_function'),
    path('api/check-learner-username-availability/', learner_views.check_learner_username_availability, name='check_learner_username_availability'),
    path('api/check-learner-unique-fields/', learner_views.check_learner_unique_fields, name='learner_check_learner_unique_fields'),
    path('api/get-learner-csrf-token/', learner_views.get_learner_csrf_token, name='get_learner_csrf_token'),

    #path('api/upload-learner-profile-picture/', learner_views.upload_learner_profile_picture, name='upload_learner_profile_picture'),
    path('api/educator-send-otp/', educator_views.educator_send_otp, name='educator_send_otp'),
    path('api/educator-verify-otp/', educator_views.educator_verify_otp, name='educator_verify_otp'),
    path('api/educator-signup/', educator_views.educator_signup, name='educator_signup'),
    path('api/educator-login/', educator_views.educator_login, name='educator_login'),  
    path('api/educator-space/<int:educator_id>/', educator_views.educator_space, name='educator_space'),
    path('api/educator-profile/', educator_views.educator_profile, name='educator_profile'),
    path('api/educator-courses/', educator_views.educator_courses, name='educator_courses'),
    path('', educator_views.home, name='home'),
    path('fetch-educator-session-data/', educator_views.fetch_educator_session_data, name='fetch_educator_session_data'),
    path('your-view/', educator_views.educator_view_function, name='educator_view_function'),
    path('api/check-educator-username-availability/', educator_views.check_educator_username_availability, name='check_educator_username_availability'),
    path('api/check-educator-unique-fields/', educator_views.check_educator_unique_fields, name='check_educator_unique_fields'),
    path('api/get-educator-csrf-token/', educator_views.get_educator_csrf_token, name='get_educator_csrf_token'),
    path('api/add-educator-courses/', educator_views.add_educator_courses, name='add_educator_courses'),
    path('api/educator-course-inlook/<int:course_id>/', educator_views.educator_course_inlook, name='educator_course_inlook'), 

    path('api/admin-login/', admin_views.admin_login, name='admin_login'),
    path('api/admin-courses/', admin_views.admin_courses, name='admin_courses'),
    path('api/release-course/<int:course_id>/', admin_views.release_course, name='release_course'),

    ]

