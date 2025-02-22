from rest_framework.serializers import ModelSerializer
from brainy_rats_app.api.models import Dataset, DatasetRow
from brainy_rats_app.users.models import User


class DatasetRowSerializer(ModelSerializer):
    class Meta:
        model = DatasetRow
        fields = (
            'score',
            'index',
        )


class DatasetSerializer(ModelSerializer):
    rows = DatasetRowSerializer(many=True)

    class Meta:
        model = Dataset
        fields = (
            'name',
            'size',
            'rows'
        )

    def create(self, validated_data):
        user = self.context['request'].user
        dataset = Dataset(user=user, name=validated_data.get("name"), size=validated_data.get('size'))
        dataset.save()
        rows_list = validated_data.get('rows')
        for r in rows_list:
            DatasetRow.objects.create(ds=dataset, **r)
        return validated_data


class DatasetListSerializerView(ModelSerializer):
    #rows = DatasetRowSerializer(many=True, read_only=True)

    class Meta:
        model = Dataset
        fields = (
            'name',
        )
class DatasetSerializerView(ModelSerializer):
    rows = DatasetRowSerializer(many=True, read_only=True)

    class Meta:
        model = Dataset
        fields = (
            'name',
            'rows'
        )

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'password'
        )
