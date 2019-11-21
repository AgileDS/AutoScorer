from rest_framework.authtoken import views
from django.urls import path
from brainy_rats_app.api.views import HelloView, DatasetViewSet

app_name = 'api'
urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token, name='token_auth'),
    path('hello/', HelloView.as_view(), name='hello'),
    path('dataset/', DatasetViewSet.as_view(), name='dataset'),
]
