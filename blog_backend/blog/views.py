from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer
from .serializers import UserSerializer
from .serializers import RegisterSerializer

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
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class PostDetailAPIView(APIView):
    authentication_classes = []  # Permitir acceso sin autenticación
    permission_classes = [] # Permitir acceso sin permisos
    def get(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    
    def put(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.delete()
        return Response(status=204)
    
class PostPublishAPIView(APIView):
    authentication_classes = []  # Permitir acceso sin autenticación
    permission_classes = [] # Permitir acceso sin permisos

    def get(self, request, *args, **kwargs):
        post = Post.objects.filter(status=1).order_by('-created_at')
        paginator = CustomPagination()
        paginated_posts = paginator.paginate_queryset(post, request)
        serealizer = PostSerializer(paginated_posts, many=True)
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
        serializer = PostSerializer(data=data)
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
        
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class UserPostListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_posts = Post.objects.filter(user=request.user).order_by('-created_at')
        serializer = PostSerializer(user_posts, many=True)
        return Response(serializer.data)
            