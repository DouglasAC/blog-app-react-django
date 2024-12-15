from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Category, Tag

DEFAULT_CATEGORIES = [
    "Tecnología",
    "Ciencia",
    "Arte y Cultura",
    "Salud",
    "Estilo de Vida",
    "Negocios",
    "Educación",
    "Deportes",
    "Noticias",
    "Naturaleza",
    "Animales",
    "Entretenimiento"
]

@receiver(post_migrate)
def create_default_categories(sender, **kwargs):
    if sender.name == "blog":
        for category in DEFAULT_CATEGORIES:
            Category.objects.get_or_create(name=category, slug=category.lower().replace(" ", "-"))

DEFAULT_TAGS = [
    "Python",
    "Django",
    "IA",
    "Ciberseguridad",
    "Desarrollo Web",
    "Meditación",
    "Ejercicio",
    "Recetas",
    "Cine",
    "Pintura",
    "Música",
    "Viajes",
    "Decoración",
    "Aprendizaje",
    "Métodos de Estudio",
    "Cursos",
    "Marketing",
    "Finanzas",
    "Fútbol",
    "Baloncesto",
    "Eventos",
    "Espacio Exterior",
    "Medio Ambiente",
    "Inpiración",
    "Noticias del Mundo",
    "Historias cortas",
    "Cuentos",
    "Mascotas",
    "Animales Salvajes",
    "Humor",
    "Curiosidades",
    "Juegos",
    "Películas",
    "Series",
    "Libros",
    "Cómics",
]

@receiver(post_migrate)
def create_default_tags(sender, **kwargs):
    if sender.name == "blog":
        for tag in DEFAULT_TAGS:
            Tag.objects.get_or_create(name=tag, slug=tag.lower().replace(" ", "-"))