from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatHistory(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  role = models.CharField(max_length=10) # 'user' or 'model'
  message = models.TextField()
  timestamp = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ['timestamp']

  def __str__(self):
    return f"{self.user.username}: {self.message[:50]}"