from django.urls import path
from . import views
from .utils import plaid

urlpatterns = [
    path('expenses/', views.expense_list, name='expense_list'),
    path('expenses/<int:id>/', views.expense_list, name='expense_list'),
    path('signup/', views.user_post, name='user_post'),
    path('reset-password-email/', views.reset_password_email, name='reset_password_email'),
    path('code-verification/',views.code_verification, name='code_verification'),
    path('update_monthly_budget/', views.update_monthly_budget, name='update_monthly_budget'),
    path('categories/', views.category_list, name='category_list'),
    path('auth-status/', views.authentication_status, name='authentication_status'),
    path('api/auth/google/', views.google_login, name='google_login'),
    path('get-user/', views.get_user, name='get_user'),
    path('get-profile-settings/', views.get_profile_settings, name='get_profile_settings'),
    path('get-currency-exchange/<str:from_currency>/<str:to_currency>/', views.get_currency_exchange, name='get_currency_change'),
    path('create-link-token/', plaid.create_link_token, name='create-link-token'),
    path('exchange-public-token/',plaid.exchange_public_token, name='exchange-public-token'),
    path('get-transactions/',plaid.get_transactions, name='get-transactions'),
    path('get-balance/',plaid.get_balance,name='get-balance'),
    #path('get-investments/',views.get_investments,name='get-investments'),
]
