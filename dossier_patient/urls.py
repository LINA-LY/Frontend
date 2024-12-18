from django.urls import path
from . import views

urlpatterns = [
    path('create_dpi/', views.create_dpi, name='create_dpi'),
    path('view_dpi/<str:nss>/', views.view_dpi, name='view_dpi'),
]
