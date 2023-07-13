from django.http import HttpResponse

import sys
import json
import random
import string
import numpy as np
import pandas as pd

from .tools import Tools
from .models import *

from .store import *
from django.core import mail

# sys.path.append('D:\\Code\\23-SummerProject\\2023-BJTU-Summer-Project\\model')
# 这里路径怎么都不是很对，我把model复制了一份到python的基准路径下

from model.predictor import Predictor


# === Account === #
def login(request):
    return sign(request=request, auto_create_account=False)


def register(request):
    # return sign(request=request, auto_create_account=True)
    # refactor: 注册的逻辑现在和登录区别较大，重构注册函数
    result = {}


def sendVerifyCode(request):
    vrcode = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    mail.send_mail(
        subject='BLUESPACE 验证码',  # 题目
        message='您的 BLUESPACE 验证码为: ' + vrcode,  # 消息内容
        from_email='zoransy@foxmail.com',  # 发送者[当前配置邮箱]
        recipient_list=['xxx@qq.com'],  # 接收者邮件列表
    )


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
    '''
    初级模型预测接口
    '''
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
    '''
    高级模型预测接口
    '''
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


def DNN_predict(request):
    '''
    DNN模型预测接口
    '''
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')

    data = json.loads(request.body)

    if 'token' not in data or data['token'] is None:
        return Tools.toErrorResponse('Token is none.')
    token = data['token']

    predictor = Predictor()

    result = predictor.predict(3, request.body)

    if result == -1:
        return Tools.toErrorResponse('Prediction incorrect.')

    return Tools.toResponse(result, 200)