# expenseTracker/serializers.py
from rest_framework import serializers
from .models import Expense,User,Category

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']

class ExpenseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Make user read-only since it will be set in the create method
    category = CategorySerializer()

    class Meta:
        model = Expense
        fields = ['user', 'category', 'description', 'amount', 'start_date', 'end_date', 'created_at', 'updated_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        print(validated_data)
        category_data = validated_data.pop('category')
        #print(category_data)
        category, created = Category.objects.get_or_create(**category_data)
        
        # Create the expense and link the current user
        expense = Expense.objects.create(
            user=self.context['request'].user,  # Automatically set the user from the request
            category=category,
            **validated_data
        )
        return expense