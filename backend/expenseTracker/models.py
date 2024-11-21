from django.db import models
from django.contrib.auth.models import User
# Create your models here.
    
class Expense(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=150,default="placeholder")
    category = models.CharField(max_length=150, default=None, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    CURRENCIES = {
        "usd": "US Dollar $",
        "eur": "Euro €",
        "gbp": "Great Britain Pound £",
        "jpy": "Japan Yen ¥",
        "aud": "Australian Dollar $",
        "cad": "Canadian Dollar $",
        "krw": "Korean Won ₩",
        "inr": "Indian Rupee ₹"
    }
    currency = models.CharField(max_length=3, choices=CURRENCIES, default="usd")
    frequency = models.CharField(max_length=10, 
                choices=[
                ('monthly', 'monthly'),
                ('yearly', 'yearly'),
                (None, 'None'),
                ],                  
            null=True, blank=True)
    period = models.DecimalField(decimal_places=0, max_digits=10, null=True, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"User {self.user}, spent {self.amount}, category is {self.category}, this was created at {self.created_at}"
    