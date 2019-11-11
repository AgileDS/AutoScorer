from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


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
