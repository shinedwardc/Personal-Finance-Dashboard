from django.shortcuts import render
from .models import Expense
from rest_framework.decorators import api_view
from rest_framework.response import Response

#Create your views here
def expense_list(request):
    expenses = Expense.objects.all()
    return render(request, 'expenseTracker/expense_list.html', {'expenses': expenses})

@api_view(['GET'])
def hello(request):
    return Response({'message': 'Hello world!'})

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