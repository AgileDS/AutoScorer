from rest_framework.serializers import ModelSerializer

from brainy_rats_app.api.models import Dataset
from brainy_rats_app.users.models import User


class DatasetSerializer(ModelSerializer):
    class Meta:
        model = Dataset
        fields = (
            'name',
        )


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'password'
        )
