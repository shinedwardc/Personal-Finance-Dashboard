from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def check_authentication(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'is_authenticated': False
            }, status=status.HTTP_401_UNAUTHORIZED)
        return view_func(request, *args, **kwargs)
    return wrapper