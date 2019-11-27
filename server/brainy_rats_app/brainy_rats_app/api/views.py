from brainy_rats_app.api.models import Dataset
from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet


from brainy_rats_app.api.serializers import DatasetSerializer, DatasetSerializerView

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