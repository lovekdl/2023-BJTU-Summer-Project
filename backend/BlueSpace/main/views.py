from django.http import HttpResponse

import sys
import json
import numpy as np
import pandas as pd

from .tools import Tools
from .models import *

sys.path.append(r'..\..\..\model')
from model.predictor import Predictor

# === Account === #
def login(request):
    return sign(request=request, auto_create_account=False)

def register(request):
    return sign(request=request, auto_create_account=True)

def sign(request, auto_create_account: bool):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    data = json.loads(request.body)

    if 'username' not in data or data['username'] is None:
        return Tools.toErrorResponse('Username is none.')
    username = data['username']

    if 'password' not in data or data['password'] is None:
        return Tools.toErrorResponse('Password is none.')
    password = data['password']

    users = User.objects.filter(username=username)

    if users.count() == 0:
        if auto_create_account == False:
            return Tools.toErrorResponse('Username doesn\'t exist.')
        user = User(username=username, password=password)
        user.save()
    else:
        if auto_create_account == True:
            return Tools.toErrorResponse('Username exists.')
        user = users.first()

    if user.password != password:
        return Tools.toErrorResponse('Password is incorrect.')

    result['state'] = 'success'
    result['token'] = Tools.encode(username, password)

    return Tools.toResponse(result, 200)


# === Prediction === #
def junior_predict(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    data = json.loads(request.body)

    if 'token' not in data or data['token'] is None:
        return Tools.toErrorResponse('Token is none.')
    token = data['token']
    

    predictor = Predictor()
    
    result = predictor.predict(2, request.body)
    
    if result == -1:
        return Tools.toErrorResponse('Prediction incorrect.')
    

    return Tools.toResponse(result, 200)

def senior_predict(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    data = json.loads(request.body)

    if 'token' not in data or data['token'] is None:
        return Tools.toErrorResponse('Token is none.')
    token = data['token']
    

    predictor = Predictor()
    
    result = predictor.predict(1, request.body)
    
    if result == -1:
        return Tools.toErrorResponse('Prediction incorrect.')
    

    return Tools.toResponse(result, 200)