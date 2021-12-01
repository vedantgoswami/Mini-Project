from django.db import models
from django.db.models.base import Model
from django.db.models.query import FlatValuesListIterable

# Create your models here.
class state(models.Model):
    head_x = models.IntegerField(null=False,default=1)
    head_y = models.IntegerField(null = False,default=1)
    food_x = models.IntegerField(null=False,default=1)
    food_y = models.IntegerField(null=False,default=1)
    done_s = models.BooleanField(null=False,default=False)
    reward_s = models.IntegerField(null=False,default=0)
    score_s = models.IntegerField(null=False,default=0)
    direction_s = models.CharField(null=False, max_length=50)
    col_l = models.BooleanField(null=False, default=False)
    col_r = models.BooleanField(null=False, default=False)
    col_u = models.BooleanField(null=False, default=False)
    col_d = models.BooleanField(null=False, default=False)
    mode_s = models.CharField(null=False,default=False,max_length=5)
    user = models.CharField(null=False,default="User",max_length=20)

class move(models.Model):
    nextmove = models.CharField(null=False,default="STRAIGHT",max_length=5)
class reward(models.Model):
    reward_s = models.IntegerField(null=False,default=0)
    head_x = models.IntegerField(null=False,default=1)
    head_y = models.IntegerField(null = False,default=1)
    food_x = models.IntegerField(null=False,default=1)
    food_y = models.IntegerField(null=False,default=1)
    done_s = models.BooleanField(null=False,default=False)
    score_s = models.IntegerField(null=False,default=0)
    direction_s = models.CharField(null=False ,max_length=50)
    col_l = models.BooleanField(null=False, default=False)
    col_r = models.BooleanField(null=False, default=False)
    col_u = models.BooleanField(null=False, default=False)
    col_d = models.BooleanField(null=False, default=False)
    mode_s = models.CharField(null=False,default=False,max_length=5)
    
class model_selection(models.Model):
    select = models.CharField(null=False,default="T",max_length=1)

class user(models.Model):
    username = models.CharField(null=False,max_length=20)
    name = models.CharField(null=False,max_length=20)
    password = models.CharField(null=False,max_length=20)
    email = models.EmailField()

class user_stats(models.Model):
    username = models.CharField(null=False,max_length=20)
    score = models.IntegerField(null=False,default=0)
    time = models.CharField(null=False,default="Not Available",max_length=30)
    
class trained_model(models.Model):
    username = models.CharField(null=False,max_length=20)
    trained_file = models.FileField(blank=True,null=True)
class image_data(models.Model):
    username = models.CharField(null=False,max_length=20)
    image = models.ImageField(upload_to="./frontend/static/Download",null=False)
    