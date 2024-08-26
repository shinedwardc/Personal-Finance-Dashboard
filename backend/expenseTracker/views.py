from django.shortcuts import render
from .models import Expense, Category
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from expenseTracker.serializers import ExpenseSerializer, CategorySerializer, UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
#Create your views here
@api_view(['GET','POST'])
def expense_list(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=401)
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
    
@api_view(['DELETE'])
def delete_expense(request,id):
    try:
        print(id)
        expense = Expense.objects.get(pk=id, user=request.user)
        expense.delete()
        return Response({'Successfully deleted expense'},status=status.HTTP_204_NO_CONTENT)
    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response({'categories': serializer.data})

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
#from django.http import HttpResponse
#from django.template import loader

#from .models import Question


#def index(request):
#    latest_question_list = Question.objects.order_by("-pub_date")[:5]
#    template = loader.get_template("polls/index.html")
#    context = {
#        "latest_question_list": latest_question_list,
#    }
#    return HttpResponse(template.render(context, request))