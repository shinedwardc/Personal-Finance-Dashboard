# expenseTracker/serializers.py
from rest_framework import serializers
from .models import Transaction,User, UserSettings, Investment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Make user read-only since it will be set in the create method

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'name', 'type', 'category', 'amount', 'currency', 'frequency', 'period','date', 'created_at', 'updated_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        print(validated_data)
        # Create the transaction and link the current user
        transaction = Transaction.objects.create(
            user=self.context['request'].user,  # Automatically set the user from the request
            **validated_data
        )
        return transaction
    
class UserSettingsSerializer(serializers.ModelSerializer):
    # Income based budget
    income_based_budget = serializers.SerializerMethodField()

    class Meta:
        model = UserSettings
        fields = "__all__"
    
    def get_income_based_budget(self, obj):
        return obj.get_income_based_budget

class InvestmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Make user read-only since it will be set in the create method

    class Meta:
        model = Investment
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        print(validated_data)
        # Create the expense and link the current user
        investment = Investment.objects.create(
            user=self.context['request'].user,  # Automatically set the user from the request
            **validated_data
        )
        return investment