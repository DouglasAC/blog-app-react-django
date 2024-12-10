from django.urls import path
from . import views

urlpatterns = [
    path('api/posts/', views.PostListAPIView.as_view(), name='post-list'),
    path('api/users/', views.UserListCreateAPIView.as_view(), name='user-list'),
    path('api/posts/<int:pk>/', views.PostDetailAPIView.as_view(), name='post-detail'),
]