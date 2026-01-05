from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum

# Create or update the profile when a user is created or saved
from django.db.models.signals import post_save
from django.dispatch import receiver

# Transaction model    
class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=150,default="placeholder")
    type = models.CharField(max_length=15, choices=[("Expense", "Expense"), ("Income", "Income")])
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
        return f"Id: {self.id}, User {self.user}, spent {self.amount}, category is {self.category}, transaction date is {self.date}. This was created at {self.created_at}"
    
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

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Budget settings
    monthly_budget = models.IntegerField(blank=True, null=True)
    category_budget_limits = models.JSONField(default=dict, blank=True)
    over_spending_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=0.8)
    
    # User display preferences
    display_currency = models.CharField(max_length=3)
    display_date_format = models.CharField(max_length=20, blank=True, null=True)
    display_dashboard_range = models.CharField(max_length=20, choices=[
        ("Current Month", "Current Month"),("30 Days", "30 Days"), ("Quarter", "Quarter"), ("Year", "Year"), ("All", "All")
    ], default="Current Month")
    notifications_enabled = models.BooleanField(default=False)
    income_affects_budget = models.BooleanField(default=False)
    income_ratio_for_budget = models.DecimalField(max_digits=20, decimal_places=2, null=True)

    @property
    def get_income_based_budget(self):
        # Returns the budget including income if the setting is enabled.
        if not self.income_affects_budget:
            return None
        if self.income_ratio_for_budget is None:
            return self.monthly_budget
        total_income = Transaction.objects.filter(
            user = self.user,
            type = 'Income',
            date__month = timezone.now().month,
            date__year = timezone.now().year,
        ).aggregate(total=Sum('amount'))['total'] or 0
        income_based_budget = total_income * (self.income_ratio_for_budget / 100); 
        return income_based_budget
    
    def save(self, *args, **kwargs):
        if not self.income_affects_budget:
            self.income_ratio_for_budget = None
        super().save(*args, **kwargs)

    
@receiver(post_save, sender=User)
def create_or_update_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(user=instance)
    instance.usersettings.save()