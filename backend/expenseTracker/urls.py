from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.expense_list, name='expense_list'),
    path('expenses/<int:id>/', views.expense_list, name='expense_list'),
#    path('delete-expense/<int:id>', views.delete_expense, name='delete_expense'),
    path('categories/', views.category_list, name='category_list'),
    path('signup/', views.user_post, name='user_post'),
    path('get-user/', views.get_user, name='get_user'),
    path('get-currency-exchange/<str:from_currency>/<str:to_currency>/', views.get_currency_exchange, name='get_currency_change')
]
