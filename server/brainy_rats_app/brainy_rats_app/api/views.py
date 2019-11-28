
from brainy_rats_app.api.models import Dataset
from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView

from rest_framework.generics import GenericAPIView, CreateAPIView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.settings import api_settings

from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from rest_framework.authtoken.models import Token


from brainy_rats_app.api.serializers import DatasetSerializer, DatasetSerializerView, UserSerializer

from brainy_rats_app.users.models import User

class TokenPermission(IsAuthenticated):
    '''
    Class to check if the tocken is valid.
    '''

    def has_permission(self, request, view):
        user = request.user
        token = ''
        pass


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class DatasetCreateView(CreateAPIView): 
    permission_classes = (IsAuthenticated,)
    serializer_class = DatasetSerializer

class DatasetListView(ListAPIView): 
    #permission_classes = (IsAuthenticated,)
    serializer_class = DatasetSerializerView

    def get_queryset(self):
        #return Dataset.objects.all()
        user = self.request.user
        return Dataset.objects.filter(owner=user)



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
