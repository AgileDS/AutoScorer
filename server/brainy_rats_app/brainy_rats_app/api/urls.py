from rest_framework.authtoken import views
from django.urls import path
from brainy_rats_app.api.views import HelloView, DatasetCreateUpdateView, DatasetListView, CreateUserAPIView

app_name = 'api'
urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token, name='token_auth'),
    path('hello/', HelloView.as_view(), name='hello'),
    path('update-create-dataset/', DatasetCreateUpdateView.as_view(), name='dataset_create_update'),
    path('dataset_list/', DatasetListView.as_view(), name='dataset'),
    path('create-user/', CreateUserAPIView.as_view(), name='create_user_api')

]
