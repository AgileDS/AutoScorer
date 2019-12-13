from brainy_rats_app.api.models import Dataset, DatasetRow
from rest_framework.generics import ListAPIView

from rest_framework.generics import GenericAPIView, RetrieveAPIView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.settings import api_settings

from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from rest_framework.authtoken.models import Token


from brainy_rats_app.api.serializers import DatasetListSerializerView, DatasetSerializer, DatasetSerializerView, UserSerializer

from brainy_rats_app.users.models import User


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class RowsNotSyncronyzed(BaseException):
    pass


class DatasetCreateUpdateView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = DatasetSerializer

    def post(self, request, *args, **kwargs):
        return self.create_or_update(request, *args, **kwargs)

    def create_or_update(self, request, *args, **kwargs):
        request.data['user'] = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created = self.perform_create_or_update(serializer, request.data)
        headers = self.get_success_headers(serializer.data)
        return Response({'Anze the boss': True, 'Created?': created}, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create_or_update(self, serializer, data):
        dataset = Dataset.objects.filter(
            name=data['name'],
            user=data['user'],
            size=data['size'],
        ).first()
        if not dataset:
            serializer.save()
            created = True
        else:
            for row_data in data['rows']:
                DatasetRow.objects.update_or_create(
                    ds=dataset,
                    index=row_data['index'],
                    defaults={'score': row_data['score']}
                )
            created = False
        return created

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}

class DatasetView(RetrieveAPIView): 
    permission_classes = (IsAuthenticated,)
    lookup_field = 'name'
    serializer_class = DatasetSerializerView

    def get_queryset(self):
        user = self.request.user
        return Dataset.objects.filter(user=user)


    
 
class DatasetListView(ListAPIView): 
    permission_classes = (IsAuthenticated,)
    
    serializer_class = DatasetListSerializerView

    def get_queryset(self):
        user = self.request.user
        return Dataset.objects.filter(user=user)
    

class CreateUserAPIView(GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username, password = (request.data['username'], request.data['password'])
        try:
            password_validation.validate_password(password, username)
        except ValidationError:
            return JsonResponse({'Error': 'Password not valid'})
        self.perform_create(serializer)
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        token = Token.objects.get(user=user)
        headers = self.get_success_headers(serializer.data)
        return Response({'username': username, 'password': password, 'token': token.key}, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
