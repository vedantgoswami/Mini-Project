
from django.urls import path
from .views import UploadImage,CreateStateView, GetReward, loginUser, stateview, SelectionModel, createUser, login_getname, logoutUser,gameOver,getScore
urlpatterns = [
    path('home',stateview.as_view()),
    path('create-state',CreateStateView.as_view()),
    path('reward-state',GetReward.as_view()),
    path('selection',SelectionModel.as_view()),
    path('create-user',createUser.as_view()),
    path('login-user',loginUser.as_view()),
    path('login-getname',login_getname.as_view()),
    path('logout',logoutUser.as_view()),
    path('gameover',gameOver.as_view()),
    path('user-score',getScore.as_view()),
    path('image-state',UploadImage.as_view())
]