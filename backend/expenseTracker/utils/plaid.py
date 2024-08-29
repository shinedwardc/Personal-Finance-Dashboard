import plaid
from plaid.api import plaid_api
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from datetime import datetime, timedelta
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from rest_framework.decorators import api_view


import environ
env = environ.Env()
environ.Env.read_env()
from django.http import JsonResponse

configuration = plaid.Configuration(
    host = plaid.Environment.Sandbox,
    api_key={
        'clientId': env('CLIENT_ID'),
        'secret': env('SECRET'),
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

@api_view(['POST'])
def create_link_token(request):
    try:
        link_token_request = LinkTokenCreateRequest(
            user={
                'client_user_id': 'shinedwardc'
            },
            client_name='expense-tracker',
            products=[Products("auth"),Products("transactions")],
            country_codes=[CountryCode("US")],
            language='en'
        )
        response = client.link_token_create(link_token_request)
        link_token = response['link_token']
        return JsonResponse({'link_token': link_token})
    except plaid.ApiException as error:
        return JsonResponse({'error': str(error)}, status=500)

@api_view(['POST'])
def exchange_public_token(request):
    try:
        public_token = request.data.get('public_token')
        if not public_token:
            return JsonResponse({'error': 'Public token is required'}, status=400)

        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        return JsonResponse({'access_token': access_token})
    except plaid.ApiException as error:
        return JsonResponse({'error': str(error)}, status=500)

@api_view(['GET'])
def get_transactions(request):
    try:
        access_token = request.GET.get('access_token')
        if not access_token:
            return JsonResponse({'error': 'Access token is required'}, status=400)

        # Set date range for the last 30 days
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)

        request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date,
            options=TransactionsGetRequestOptions(
                count=100,
                offset=0
            )
        )
        response = client.transactions_get(request)
        
        transactions = response['transactions']
        # Convert transactions to a serializable format
        serializable_transactions = []
        for transaction in transactions:
            serializable_transaction = {
                'id': transaction['transaction_id'],
                'amount': transaction['amount'],
                'date': transaction['date'],
                'name': transaction['name'],
                'merchant_name': transaction.get('merchant_name', ''),
                'category': transaction.get('category', []),
                'payment_channel': transaction.get('payment_channel', ''),
            }
            serializable_transactions.append(serializable_transaction)
        transactions = serializable_transactions
        print('transactions: ', transactions)
        
        # You might want to process or format the transactions here
        # before sending them back to the frontend
        
        return JsonResponse({'transactions': transactions})
    except plaid.ApiException as e:
        return JsonResponse({'error': str(e)}, status=500)
