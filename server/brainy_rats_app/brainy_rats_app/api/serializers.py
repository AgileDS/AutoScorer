from rest_framework.serializers import ModelSerializer

from brainy_rats_app.api.models import Dataset, DatasetRow


class DatasetRowSerializer(ModelSerializer):
    class Meta:
        model = DatasetRow
        fields = (
            'score',
            'eeg',
            'emg'
        )

class DatasetSerializer(ModelSerializer):
    rows = DatasetRowSerializer(many=True, read_only=True)
    class Meta:
        model = Dataset
        fields = (
            'name',
            'rows'
        )

    def create(self, validated_data):
        dataset = Dataset(name=validated_data.get("name"))
        dataset.save()        
        rows_list = validated_data.get('rows')
        for r in rows_list:
            DatasetRow.objects.create(ds=dataset, **r)
        return validated_data
