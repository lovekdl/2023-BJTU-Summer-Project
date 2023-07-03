from typing import Any
from django.db import models
from django.views.debug import default_urlconf


class User(models.Model):
    # === Property ===
    ID = models.AutoField(primary_key=True)

    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)

    authority = models.IntegerField(default=0)

    # === Methods ===
    def __str__(self):
        return self.username

class Planet(models.Model):
    # === Property ===
    
    # === Methods ===

    pass
