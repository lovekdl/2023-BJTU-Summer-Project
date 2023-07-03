from django.http import HttpResponse

from .models import *

import base64
import json

class Tools:

    # 验证成功返回True，验证失败返回False
    @staticmethod
    def verifyToken(request):
        if request.method != 'POST':
            return False, Tools.toErrorResponse('Request method is not POST.')

        data = json.loads(request.body)

        if 'token' not in data or data['token'] is None:
            return False, Tools.toErrorResponse('Token is none.')

        [username, password] = Tools.decode(data['token'])

        users = Player.objects.filter(username=username)

        if users.count() == 0:
            return False, Tools.toErrorResponse('Token is incorrect and username doesn\'t exist.')
        
        user = users.first()

        if user.password != password:
            return False, Tools.toErrorResponse('Password is incorrect.')
        
        return True, user


    @staticmethod
    def toErrorResponse(message: str):
        result = {}
        result['state'] = 'error'
        result['error_message'] = message
        return Tools.toResponse(result, status=400)

    @staticmethod
    def toResponse(dictionary, status):
        return HttpResponse(json.dumps(dictionary).encode('utf-8'), status=status)

    # 若返回空字符串，说明用户名和密码不合法
    @staticmethod
    def encode(username: str, password: str) -> str:
        if username.count(";") > 0 or password.count(";") > 0:
            return ""
        result = username + ";" + password
        result = base64.b64encode(result.encode('utf-8')).decode('utf-8')
        return result
    
    @staticmethod
    def decode(token: str):
        token = base64.b64decode(token.encode('utf-8')).decode('utf-8')
        [username, password] = token.split(';')
        return username, password
    
