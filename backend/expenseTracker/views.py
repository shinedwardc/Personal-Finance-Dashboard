from django.shortcuts import render
from .models import Expense
from rest_framework.decorators import api_view
from rest_framework.response import Response
from expenseTracker.serializers import ExpenseSerializer

#Create your views here
@api_view(['GET'])
def expense_list(request):
    expenses = Expense.objects.all()
    serializer = ExpenseSerializer(expenses, many=True)
    return Response({'expenses': serializer.data})


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