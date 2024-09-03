from django.urls import path
from . import views
from .utils import plaid

urlpatterns = [
    path('expenses/', views.expense_list, name='expense_list'),
    path('expenses/<int:id>/', views.expense_list, name='expense_list'),
#    path('delete-expense/<int:id>', views.delete_expense, name='delete_expense'),
    path('categories/', views.category_list, name='category_list'),
    path('signup/', views.user_post, name='user_post'),
    path('get-user/', views.get_user, name='get_user'),
    path('get-currency-exchange/<str:from_currency>/<str:to_currency>/', views.get_currency_exchange, name='get_currency_change'),
    path('create-link-token/', plaid.create_link_token, name='create-link-token'),
    path('exchange-public-token/',plaid.exchange_public_token, name='exchange-public-token'),
    path('get-transactions/',plaid.get_transactions, name='get-transactions'),
    path('get-balance/',plaid.get_balance,name='get-balance'),
]
