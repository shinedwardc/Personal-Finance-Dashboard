from django.shortcuts import render
from .models import Expense
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from expenseTracker.serializers import ExpenseSerializer, UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
import environ
env = environ.Env()
environ.Env.read_env()
import requests
from django.http import JsonResponse

@api_view(['GET','POST','DELETE'])
def expense_list(request,id=None):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=401)
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
@permission_classes([IsAuthenticated])
def category_list(request):
    categories = Expense.objects.filter(user=request.user).values_list('category', flat=True).distinct()
    print(list(categories))
    return Response({'categories': list(categories)})

@api_view(['GET'])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
def user_post(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('fName')
    last_name = request.data.get('lName')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User(username=username, password=make_password(password), email=email, first_name=first_name, last_name=last_name)
    user.save()

    return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

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

#def index(request):
#    latest_question_list = Question.objects.order_by("-pub_date")[:5]
#    template = loader.get_template("polls/index.html")
#    context = {
#        "latest_question_list": latest_question_list,
#    }
#    return HttpResponse(template.render(context, request))