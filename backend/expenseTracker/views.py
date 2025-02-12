from .models import Expense, Investment, EmailVerification, UserProfile
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from expenseTracker.serializers import ExpenseSerializer, UserSerializer
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

@api_view(['GET','POST','DELETE'])
@check_authentication
def expense_list(request,id=None):
    if id:
        if request.method == 'DELETE':
            try:
                print('id ',id)
                expense = Expense.objects.get(pk=id, user=request.user)
                expense.delete()
                return Response({'Successfully deleted expense'},status=status.HTTP_204_NO_CONTENT)
            except Expense.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        if request.method == 'GET':
            expenses = Expense.objects.filter(user=request.user)
            serializer = ExpenseSerializer(expenses, many=True)
            return Response({'expenses': serializer.data})
        elif request.method == 'POST':
            serializer = ExpenseSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#@api_view(['DELETE'])
#def delete_expense(request,id):

@api_view(['GET'])
@check_authentication
def category_list(request):
    categories = Expense.objects.filter(user=request.user).values_list('category', flat=True).distinct()
    print(list(categories))
    return Response({'categories': list(categories)})

@api_view(['GET'])
@check_authentication
def get_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')
    try:
        id_info = id_token.verify_oauth2_token(token, Request(), env('GOOGLE_CLIENT_ID'))
        if "sub" not in id_info:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        email = id_info['email']
        print(email)
        user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.create_user(email=email, username=email)
        print(user)
        refresh = RefreshToken.for_user(user)
        print("Refresh Token:", str(refresh))
        return Response({"access": str(refresh.access_token), 
                         "refresh": str(refresh)}, 
                         status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
    user_profile, created = UserProfile.objects.get_or_create(user=user)
    user_profile.monthly_budget = monthly_budget
    user_profile.save()

    return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

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
        return Response({"Error: user email not found"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@check_authentication
def get_profile_settings(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    return Response({'monthlyBudget': user_profile.monthly_budget}, status=status.HTTP_200_OK)

@api_view(['POST'])
@check_authentication
def update_monthly_budget(request):
    user = request.user
    monthly_budget = request.data.get('monthlyBudget')
    user_profile = UserProfile.objects.get(user=user)
    print(user_profile)
    if not monthly_budget:
        return Response({'error': 'Monthly budget is required.'}, status=status.HTTP_400_BAD_REQUEST)
    user_profile.monthly_budget = monthly_budget
    user_profile.save()
    return Response({'message': 'Monthly budget updated successfully.'}, status=status.HTTP_200_OK)

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

#@api_view(['POST'])
#def recurring_expense(request):
#    if request.method == 'POST':



#def index(request):
#    latest_question_list = Question.objects.order_by("-pub_date")[:5]
#    template = loader.get_template("polls/index.html")
#    context = {
#        "latest_question_list": latest_question_list,
#    }
#    return HttpResponse(template.render(context, request))