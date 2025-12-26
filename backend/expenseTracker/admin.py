from django.contrib import admin
from .models import Transaction, UserProfile, Investment, EmailVerification

# Transaction model
admin.site.register(Transaction)
# User profile settings (ex. budget) model
admin.site.register(UserProfile)
admin.site.register(Investment)
admin.site.register(EmailVerification)