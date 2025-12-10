from django.db import models
from django.contrib.auth.models import User

# Create or update the profile when a user is created or saved
from django.db.models.signals import post_save
from django.dispatch import receiver

# Expense model    
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
        return f"User {self.user}, spent {self.amount}, category is {self.category}, transaction date is {self.date}. This was created at {self.created_at}"
    
class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset_type = models.CharField(max_length=50, choices=[("Stock", "Stock"), ("Crypto", "Crypto")])
    symbol = models.CharField(max_length=10)  # e.g., AAPL, TSLA, BTC
    quantity = models.DecimalField(max_digits=10, decimal_places=4)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    purchase_date = models.DateField()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    monthly_budget = models.IntegerField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.user.username} has a budget limit of {self.monthly_budget}"
    
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.userprofile.save()