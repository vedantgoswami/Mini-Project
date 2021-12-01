
from django.contrib import admin
from django.urls import path
from django.urls.conf import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('api.urls')),
    path('',include('frontend.urls')),
    path('game',include('frontend.urls'))
]
