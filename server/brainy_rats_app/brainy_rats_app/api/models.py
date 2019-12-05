from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from brainy_rats_app.users.models import User


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Dataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    size = models.BigIntegerField()

    def __str__(self):
        return self.name


class DatasetRow(models.Model):
    ds = models.ForeignKey(Dataset, related_name='rows', on_delete=models.CASCADE)   
    score = models.CharField(max_length=5)
    index = models.IntegerField()
