from django.contrib import admin
from rest_framework.authtoken.admin import TokenAdmin
from brainy_rats_app.api.models import DatasetRow, Dataset

TokenAdmin.raw_id_fields = ['user']


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    pass


@admin.register(DatasetRow)
class DatasetAdmin(admin.ModelAdmin):
    pass
