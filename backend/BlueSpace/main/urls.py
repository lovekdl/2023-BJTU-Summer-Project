from django.urls import path
from . import views, planetdatas

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('predict', planetdatas.junior_predict),
    path('send', views.sendVerifyCode),
    path('avatar', views.uploadAvatar),
    path('getAvatar', views.getAvatar),
    path('modify/username', views.modifyUsername),
    path('modify/password', views.modifyPassword),
    path('getProfile', views.getProfile),
    path('linear_predict', planetdatas.getHabitableRate),
    path('save', planetdatas.savePrediction),
    path('resource', planetdatas.getResource),
    path('view/save', planetdatas.viewSaves),
    path('gethabitprop', planetdatas.getHabitableProportion),
    path('deletePlanet', planetdatas.delPrediction)
]
