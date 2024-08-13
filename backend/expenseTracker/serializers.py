# expenseTracker/serializers.py
from rest_framework import serializers
from .models import Expense,User,Category

class UserSeraizlier(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']

class ExpenseSerializer(serializers.ModelSerializer):
    user = UserSeraizlier()
    category = CategorySerializer()
    class Meta:
        model = Expense
        fields = ['user','category','description','amount','start_date','end_date','created_at','updated_at'] # Adjust fields as needed