from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import password_validation

from brainy_rats_app.api.serializers import DatasetSerializer, UserSerializer


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class DatasetViewSet(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = DatasetSerializer


class CreateUserAPIView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response
