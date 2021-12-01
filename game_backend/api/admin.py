from django.contrib import admin
from .models import user_stats,user, trained_model
# Register your models here.
admin.site.register(user_stats)
admin.site.register(user)
admin.site.register(trained_model)
