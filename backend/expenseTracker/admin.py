from django.contrib import admin
from .models import Expense, UserProfile

# Expense model
admin.site.register(Expense)
# User profile settings (ex. budget) model
admin.site.register(UserProfile)