from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
#from users.models import User

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class Dataset(models.Model):
    name = models.CharField(max_length=255)
    #user =  models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name


class DatasetRow(models.Model):
    ds = models.ForeignKey(Dataset, on_delete=models.CASCADE)   
    score = models.CharField(max_length=5)
    eeg = models.FloatField()
    emg = models.FloatField()
