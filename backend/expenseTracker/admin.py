from django.contrib import admin
from .models import Expense, UserProfile, Investment, EmailVerification

# Expense model
admin.site.register(Expense)
# User profile settings (ex. budget) model
admin.site.register(UserProfile)
admin.site.register(Investment)
admin.site.register(EmailVerification)