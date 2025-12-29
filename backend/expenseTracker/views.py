from .models import Transaction, Investment, EmailVerification, UserSettings
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from expenseTracker.serializers import TransactionSerializer, UserSerializer, UserSettingsSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
import secrets
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from .decorator import check_authentication
import environ
env = environ.Env()
environ.Env.read_env()
import requests
from django.http import JsonResponse

@api_view(['GET'])
@permission_classes([AllowAny])
def authentication_status(request):
    if request.user.is_authenticated:
        return Response({'authenticated': True})
    return Response({'authenticated': False})

@api_view(['GET','POST','DELETE','PATCH'])
@check_authentication
def transactions(request,id=None):
    if id and request.method == 'PATCH':
        try:
            print('id', id)
            transaction = Transaction.objects.get(pk=id, user=request.user)
            serializer = TransactionSerializer(transaction, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)                
        except Transaction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        if request.method == 'GET':
            if request.query_params.get('month') and request.query_params.get('year'):
                month = int(request.query_params.get('month'))
                year = int(request.query_params.get('year'))
                transactions = Transaction.objects.filter(user=request.user, date__month=month, date__year=year).order_by('date','name','category')
            else:
                transactions = Transaction.objects.filter(user=request.user).order_by('date','name','category')
            serializer = TransactionSerializer(transactions, many=True)
            return Response({'expenses': serializer.data})
        elif request.method == 'POST':
            serializer = TransactionSerializer(data=request.data, many=isinstance(request.data,list), context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':          
            ids = request.data.get('ids', [])
            if not isinstance(ids, list):
                return Response({'error': 'Expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)
            Transaction.objects.filter(id__in=ids).delete()
            return Response({'Successfully deleted expense(s)'},status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
@authentication_classes([])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(username, password)

    user = authenticate(username=username,password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)

    # Create JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    response = Response({"message": "Login successful"})

    response.set_cookie(
        key="access",
        value=str(access_token),
        httponly=True,
        secure=False,   # True in production 
        samesite="Lax",
        path="/"
    )

    response.set_cookie(
        key="refresh",
        value=str(refresh),
        httponly=True,
        secure=False,   # True in production
        samesite="Lax",
        path="/"
    )

    return response    

@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
@authentication_classes([])
def google_login(request):
    token = request.data.get('token')
    print(token)
    try:
        id_info = id_token.verify_oauth2_token(token, Request(), env('GOOGLE_CLIENT_ID'))
        # Security checks
        if id_info["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Invalid issuer")

        if not id_info.get("email_verified"):
            return Response({"error": "Email not verified"}, status=400)
        
        google_id = id_info['sub']
        email = id_info['email']
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": google_id}
        )
        user.save()
        
        userSettings, created = UserSettings.objects.get_or_create(user=user)
        userSettings.save()

        refresh = RefreshToken.for_user(user)

        response = Response({"detail": "Login successful"}, status=200)

        # Secure cookies
        response.set_cookie(
            "access",
            str(refresh.access_token),
            httponly=True,
            secure=False,        # True for production
            samesite="Lax"
        )
        response.set_cookie(
            "refresh",
            str(refresh),
            httponly=True,
            secure=False,        # True for production
            samesite="Lax"
        )
        return response

    except ValueError:
        return Response({"error": "Invalid token"}, status=401)

    except Exception as e:
        print("Google login error:", str(e))
        return Response({"error": str(e)}, status=400)
    
@api_view(["POST"])
def refresh_token(request):
    token = request.COOKIES.get("refresh")
    if not token:
        return Response({"error": "No refresh token"}, status=401)
    try:
        refresh = RefreshToken(token)
        new_access = refresh.access_token
        response = Response({"detail": "Token refreshed"}, status=200)
        response.set_cookie(
            "access",
            str(new_access),
            httponly=True,
            secure=False,     # True for production
            samesite="Lax"
        )
        return response
    except:
        return Response({"error": "Invalid refresh"}, status=401)
    

@api_view(['POST'])
def user_post(request):
    # Check user input data from request
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    monthly_budget = request.data.get('monthlyBudget')
    # Check if username already exists, prevents duplicate usernames
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User(
        username=username,
        password=make_password(password),
        email=email,
    )
    user.save()

    # Save user profile settings (monthly budget)
    user_profile, created = UserSettings.objects.get_or_create(user=user)
    user_profile.monthly_budget = monthly_budget
    user_profile.save()

    return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def logout(request):
    response = Response({"detail": "Logged out"}, status=200)
    response.delete_cookie("access")
    response.delete_cookie("refresh")
    return response

@api_view(['POST'])
def reset_password_email(request):
    email = request.data.get('email')
    user = User.objects.get(email=email)
    code = secrets.token_hex(3).upper()
    send_mail(
        "Your authentication code",
        f"Your verification code is: {code}",
        "514090db0f-53a608@inbox.mailtrap.io",
        [email],
        False
    )
    verification_object, created = EmailVerification.objects.get_or_create(user=user)
    verification_object.code = code
    verification_object.save()
    print(verification_object.code, verification_object.created_at)
    return Response({'Email sent successfully to', email}, status=status.HTTP_200_OK)


#@api_view(['POST'])
#def reset_password(request):
@api_view(['POST'])
def code_verification(request):
    code = request.data.get('code')
    email = request.data.get('email')
    try:
        verification_object = EmailVerification.objects.get(user__email=email)
        print(verification_object.code)
        print(verification_object.user)
        print(verification_object.created_at)
        if verification_object.code == code:
            time_difference = timezone.now() - verification_object.created_at
            print(time_difference)
            if (time_difference < timedelta(minutes=10)):
                user = verification_object.user
                password = request.data.get('password')
                user.set_password(password)
                user.save()
                verification_object.delete()
                return Response({"User verified successfully"},status=status.HTTP_200_OK)
            else:
                verification_object.delete()
                return Response({"Verification code expired"},status=status.HTTP_400_BAD_REQUEST)
        else:
            verification_object.delete()
            return Response({"Incorrect code"},status=status.HTTP_400_BAD_REQUEST)
    except:
        if verification_object:
            verification_object.delete()
        return Response({"Error: user email not found"},status=status.HTTP_400_BAD_REQUEST)\
        
@api_view(['GET'])
@check_authentication
def get_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@check_authentication
def get_user_settings(request):
    user = request.user
    user_settings, created = UserSettings.objects.get_or_create(user=user)
    serializer = UserSettingsSerializer(user_settings)
    return Response(serializer.data)

@api_view(['POST'])
@check_authentication
def update_budget_settings(request):
    try:
        user = request.user
        [monthly_budget, category_budget_limits, over_spending_threshold] = request.data
        user_profile = UserSettings.objects.get(user=user)
        if monthly_budget is not None:
            user_profile.monthly_budget = monthly_budget
        if category_budget_limits is not None:
            user_profile.category_budget_limits = category_budget_limits
        if over_spending_threshold is not None:
            user_profile.over_spending_threshold = over_spending_threshold
        user_profile.save()
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Monthly budget updated successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@check_authentication
def update_display_settings(request):
    try:
        user = request.user
        [display_currency, display_timezone, display_date_format, display_dashboard_range, notifications_enabled, income_affects_budget] = request.data
        user_profile = UserSettings.objects.get(user=user)
        if display_currency is not None:
            user_profile.display_currency = display_currency
        if display_timezone is not None:
            user_profile.display_timezone = display_timezone
        if display_date_format is not None:
            user_profile.display_date_format = display_date_format
        if display_dashboard_range is not None:
            user_profile.display_dashboard_range = display_dashboard_range
        if notifications_enabled is not None:
            user_profile.notifications_enabled = notifications_enabled
        if income_affects_budget is not None:
            user_profile.income_affects_budget = income_affects_budget
        user_profile.save()
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Display settings updated successfully.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_currency_exchange(request,from_currency, to_currency):
    key = env('EXCHANGE_RATE_API_KEY')
    print(key)
    print(from_currency.upper())
    url = f'https://v6.exchangerate-api.com/v6/{key}/latest/{from_currency.upper()}'
    print(url)
    response = requests.get(url)
    if response.status_code == 200:
        return JsonResponse({'rate': response.json()['conversion_rates'][to_currency.upper()]}, status=200)
    return JsonResponse({'error': 'Currency not found'}, status=400)
