from django.urls import path
from . import views

urlpatterns = [
    path('api/posts/', views.PostListAPIView.as_view(), name='post-list'),
    path('api/users/', views.UserListCreateAPIView.as_view(), name='user-list'),
    path('api/posts/<int:pk>/', views.PostDetailAPIView.as_view(), name='post-detail'),
    path('api/posts/published/', views.PostPublishAPIView.as_view(), name='published-post-list'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/create-post/', views.CreatePostView.as_view(), name='create-post'),
    path('api/update-post/<int:post_id>/', views.UpdatePostView.as_view(), name='update-post'),
    path('api/user-posts/', views.UserPostListAPIView.as_view(), name='user-post-list'),
    path('api/delete-post/<int:post_id>/', views.DeletePostView.as_view(), name='delete-post'),
    path('api/posts/<int:post_id>/like/', views.LikePostView.as_view(), name='like-post'),
]