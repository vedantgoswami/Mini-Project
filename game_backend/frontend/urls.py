from django.urls import path
from .views import index
from .views import index2
urlpatterns = [
    path('',index),
    path('game',index2),
    path('login',index),
    path('register',index),
    path('score',index)
]
