from django.db import models
from django.contrib.auth.models import User

# Create your models here.
STATUS = ( (0, "Borrador"), (1, "Publicado"))

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.IntegerField(choices=STATUS, default=0)

    def __str__(self):
        return self.title