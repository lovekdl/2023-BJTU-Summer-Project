"""ScarletMana URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # 路由分发
    path('api/', include("main.urls")),

    # DRF 提供的一系列身份认证接口，用于在页面中认证身份，详情查阅DRF文档
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # 获取Token的接口
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # 刷新Token有效期的接口
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # 验证Token有效期的接口
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
