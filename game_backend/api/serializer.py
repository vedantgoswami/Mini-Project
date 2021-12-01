from django.db.models import fields
from rest_framework import serializers
from .models import model_selection, state,move,user,user_stats,image_data

class stateSerializer(serializers.ModelSerializer):
    class Meta:
        model =state
        fields = ('head_x','head_y',
                'food_x','food_y','done_s','reward_s','score_s','direction_s','col_l','col_r','col_u','col_d','mode_s')
class CreatestateSerializer(serializers.ModelSerializer):
    class Meta:
        model = state
        fields = ('head_x','head_y',
                'food_x','food_y','done_s','reward_s','score_s','direction_s','col_l','col_r','col_u','col_d','mode_s')
class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = state
        fields = ('head_x','head_y',
                'food_x','food_y','done_s','reward_s','score_s','direction_s','col_l','col_r','col_u','col_d','mode_s')
class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = move
        fields = ('nextmove')
class SelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = model_selection
        fields = ('select',)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ('username','name','password','email')
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ('username','password')
class Login_getuserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user 
        fields = ('name',)
class gameOverSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_stats
        fields = ('username','score')
class getScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_stats
        fields = ('username','score','time')
class imageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = image_data
        fields = ('image','username')
        