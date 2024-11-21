# expenseTracker/serializers.py
from rest_framework import serializers
from .models import Expense,User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name']

class ExpenseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Make user read-only since it will be set in the create method

    class Meta:
        model = Expense
        fields = ['id','user', 'name','category', 'amount', 'currency', 'frequency', 'period','date', 'created_at', 'updated_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        print(validated_data)
        # Create the expense and link the current user
        expense = Expense.objects.create(
            user=self.context['request'].user,  # Automatically set the user from the request
            **validated_data
        )
        return expense