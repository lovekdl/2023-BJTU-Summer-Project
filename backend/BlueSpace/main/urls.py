from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('junior_predict', views.junior_predict),
    path('senior_predict', views.senior_predict),
]
