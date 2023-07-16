from django.http import HttpResponse

import sys
import json
import numpy as np
import pandas as pd
import random
import string

from .tools import Tools
from .models import *

from django.core import mail

from model.predictor import Predictor
    
# === Account === #
def login(request):
    return sign(request=request, auto_create_account=False)

def register(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
        
    data = json.loads(request.body)
    
    if 'email' not in data or data['email'] is None:
        return Tools.toErrorResponse('Emailaddrss is none.')
        
    email = data['email']
    
    if 'username' not in data or data['username'] is None:
        return Tools.toErrorResponse('Username is none.')
        
    username = data['username']
    
    if 'password' not in data or data['password'] is None:
        return Tools.toErrorResponse('Password is none.')
    
    password = data['password']
    
    if 'vertification_code' not in data or data['vertification_code'] is None:
        return Tools.toErrorResponse('VerifyCodes is none.')
    
    vrcode = data['vertification_code']
    
    users = User.objects.filter(username=username)
    emails = User.objects.filter(email=email) # 选出所有email字段与请求发送email相同的行
    user_vrcode = Verifycodes.objects.filter(username=username)
    
    if emails.count() > 0:
        return Tools.toErrorResponse('Emailaddress is already existed.')
    if users.count() > 0:
        return Tools.toErrorResponse('Username is already existed.')
    if user_vrcode.count() == 0:
        return Tools.toErrorResponse('Please get Vertification Code first.')
    if vrcode != user_vrcode.first().vrcode:
        return Tools.toErrorResponse('Vertification Code is incorrect.')
    user = User(username=username, password=password, email=email)
    user.save()
    record = Verifycodes.objects.get(username=username)
    record.delete()
    result['state'] = 'success'
    return Tools.toResponse(result, 200)

def sendVerifyCode(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
        
    data = json.loads(request.body)
    
    if 'email' not in data or data['email'] is None:
        return Tools.toErrorResponse('Emailaddrss is none.')
        
    email = data['email']
    
    if 'username' not in data or data['username'] is None:
        return Tools.toErrorResponse('Username is none.')
        
    username = data['username']
    
    emails = User.objects.filter(email=email) # 选出所有email字段与请求发送email相同的行
    users = User.objects.filter(username=username)
    
    if emails.count() > 0:
        return Tools.toErrorResponse('Emailaddress is already existed.')
    if users.count() > 0:
        return Tools.toErrorResponse('Username is already existed.')
        
    vrcode = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    mail.send_mail(
        subject='BLUESPACE 验证码',  # 题目
        message='您的 BLUESPACE 验证码为: ' + vrcode,  # 消息内容
        from_email='zoransy@foxmail.com',  # 发送者[当前配置邮箱]
        recipient_list=[data['email']],  # 接收者邮件列表
    )
    user_vrcode = Verifycodes(username=username, vrcode=vrcode)
    user_vrcode.save()
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    

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

def uploadAvatar(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    #verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject
    
    data = json.loads(request.body)
    user.avatar = data['avatar']
    user.save()
    result['state'] = 'success'

    return Tools.toResponse(result, 200)
   
def getAvatar(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    #verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject

    result['state'] = 'success'
    result['avatar'] = user.avatar
    return Tools.toResponse(result, 200)
 
def modifyUsername(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    #verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject
    
    data = json.loads(request.body)
    
    users = User.objects.filter(username=data['new_username'])
    if users.count() > 0:
        return Tools.toErrorResponse('Username is already existed.')
    user.username = data['new_username']
    user.save()
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    
def getProfile(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    #verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject
    
    result['email'] = user.email
    result['username'] = user.username
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    
def modifyPassword(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    #verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject
    
    data = json.loads(request.body)
    if user.password == data['new_password']:
        return Tools.toErrorResponse('Your new Password should be different from your old one.')

    user.password = data['new_password']
    user.save()
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    
