from rest_framework.serializers import ModelSerializer

from brainy_rats_app.api.models import Dataset

class DatasetSerializer(ModelSerializer):
    class Meta:
        model = Dataset
        fields = (
            'name',
        )