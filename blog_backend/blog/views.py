from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Post, Like, Comment, Category, Tag
from .serializers import PostSerializer
from .serializers import UserSerializer
from .serializers import RegisterSerializer
from .serializers import CommentSerializer
from .serializers import CategorySerializer
from .serializers import TagSerializer
from django.db.models import Count, Sum

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

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'has_more': self.page.has_next(),
            'results': data
        })

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
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = CustomPagination

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
        #print(f"Usuario autenticado: {request.user}")
        title = request.query_params.get('title', None)
        author = request.query_params.get('author', None)
        category = request.query_params.get('category', None)
        tags = request.query_params.getlist('tags[]', None)
        date = request.query_params.get('date', None)
        sortby = request.query_params.get('sortBy', None)
        limit = request.query_params.get('limit', None)
        post = Post.objects.filter(status=1)
        if title:
            post = post.filter(title__icontains=title)
        if author:
            post = post.filter(user__username=author)
        if category:
            post = post.filter(category__id=category)
        if tags:
            post = post.filter(tags__id__in=tags).distinct()
        if date:
            post = post.filter(created_at__date=date)
        if sortby:
            print("sortby: ", sortby)
            if sortby == 'popular':
                post = post.annotate(like_count=Count('like')).order_by('-like_count')
            elif sortby == 'recent':
                post = post.order_by('-created_at')
            elif sortby == 'oldest':
                post = post.order_by('created_at')
        else:
            post = post.order_by('-created_at')
        if limit:
            post = post[:int(limit)]
        print("post len: ",len(post))
        paginator = CustomPagination()
        paginated_posts = paginator.paginate_queryset(post, request)
        #print(request.user)
        serealizer = PostSerializer(paginated_posts, many=True, context={'request': request})
        return paginator.get_paginated_response(serealizer.data)
    
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
        print("Data: ", data)
        serializer = PostSerializer(data=data,context={'request': request})
        print("Serializer data: ", serializer.initial_data)
        
        if serializer.is_valid():
            print("Serializer is valid: ", serializer.validated_data)
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
    
class CategoryListCreateAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({
                'error': 'No autorizado'
            }, status=401)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TagListCreateAPIView(APIView):
    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({
                'error': 'No autorizado'
            }, status=401)
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class UserStatisticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Número total de publicaciones
        total_posts = user.post_set.filter(status=1).count()
        # Numeto total de borradores
        total_drafts = user.post_set.filter(status=0).count()
        # Top 3 categorías más utilizadas
        top_categories = user.post_set.filter(status=1).values('category__name').annotate(count=Count('category')).order_by('-count')[:3]
        # Top 3 etiquetas más utilizadas
        top_tags = user.post_set.filter(status=1).values('tags__name').annotate(count=Count('tags')).order_by('-count')[:3]
        # Número total de likes
        total_likes = user.post_set.filter(status=1).aggregate(total_likes=Count('like'))['total_likes']
        # Número total de comentarios recibidos
        total_comments = user.post_set.filter(status=1).aggregate(total_comments=Count('comments'))['total_comments']
        # Publicaciones más gustadas
        posts = Post.objects.filter(status=1, user=user).annotate(likes_count=Count('like', distinct=True),comments_count=Count('comments', distinct=True)).values('id', 'title', 'likes_count', 'comments_count').order_by("-likes_count")[:3]
       
        return Response({
            'total_posts': total_posts,
            'total_drafts': total_drafts,
            'most_liked_posts': posts if posts else None,
            'top_category': top_categories if top_categories else None,
            'top_tags': top_tags if top_tags else None,
            'total_likes': total_likes,
            'total_comments': total_comments
        })