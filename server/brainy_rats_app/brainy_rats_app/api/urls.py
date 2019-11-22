from rest_framework.authtoken import views
from django.urls import path
from brainy_rats_app.api.views import HelloView, DatasetCreateView, DatasetListView

app_name = 'api'
urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token, name='token_auth'),
    path('hello/', HelloView.as_view(), name='hello'),
    path('dataset/', DatasetCreateView.as_view(), name='dataset'),
    path('dataset_list/', DatasetListView.as_view(), name='dataset'),
]

