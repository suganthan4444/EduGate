from django.middleware.csrf import get_token
from django.http import HttpRequest, HttpResponse

class CSRFTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        csrf_token = get_token(request)

        request.session['csrf_token'] = csrf_token

        response = self.get_response(request)
        
        return response
