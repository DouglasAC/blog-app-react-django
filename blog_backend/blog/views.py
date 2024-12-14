from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Post, Like, Comment
from .serializers import PostSerializer
from .serializers import UserSerializer
from .serializers import RegisterSerializer
from .serializers import CommentSerializer

# Create your views here.

class UserListCreateAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class PostListAPIView(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class PostDetailAPIView(APIView):
    
    permission_classes = [] # Permitir acceso sin permisos
    def get(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.delete()
        return Response(status=204)
    
class PostPublishAPIView(APIView):
    permission_classes = [] # Permitir acceso sin autenticación

    def get(self, request, *args, **kwargs):
        print(f"Usuario autenticado: {request.user}")
        title = request.query_params.get('title', None)
        author = request.query_params.get('author', None)
        post = Post.objects.filter(status=1).order_by('-created_at')
        if title:
            post = post.filter(title__icontains=title)
        if author:
            post = post.filter(user__username=author)
        paginator = CustomPagination()
        paginated_posts = paginator.paginate_queryset(post, request)
        print(request.user)
        serealizer = PostSerializer(paginated_posts, many=True, context={'request': request})
        return Response(serealizer.data)
    
class RegisterView(APIView):
    authentication_classes = []  # Permitir acceso sin autenticación
    permission_classes = [] # Permitir acceso sin permisos

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        data['user'] = request.user.id
        
        serializer = PostSerializer(data=data,context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class UpdatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
        except Post.DoesNotExist:
            return Response({
                'error': 'No se encontró el post'
            }, status=404)
        
        serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class UserPostListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_posts = Post.objects.filter(user=request.user).order_by('-created_at')
        serializer = PostSerializer(user_posts, many=True, context={'request': request})
        return Response(serializer.data)
            
class DeletePostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
        except Post.DoesNotExist:
            return Response({
                'error': 'No se encontró el post'
            }, status=404)
        
        post.delete()
        return Response(status=204)
    
class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like, created = Like.objects.get_or_create(post=post, user=request.user)
            if not created:
                like.delete()
                return Response({"message": "Like eliminado", "likes_count": post.like_set.count(), "liked": False},status=200)
        
            return Response({"message": "Like agregado", "likes_count": post.like_set.count(), "liked": True}, status=201)
        except Post.DoesNotExist:
            return Response({
                'error': 'No se encontró el post'
            }, status=404)
        
class CommentListCreateAPIView(APIView):

    def get(self, request, post_id, *args, **kwargs):
        comments = Comment.objects.filter(post=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    def post(self, request, post_id, *agrs, **kwargs):
        if not request.user.is_authenticated:
            return Response({
                'error': 'No autorizado'
            }, status=401)
        
        data = request.data
        data['post'] = post_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user) 
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)