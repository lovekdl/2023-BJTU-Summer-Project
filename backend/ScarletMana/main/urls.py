from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('resource', views.resource),

    path('employ', views.employ),
    path('dwarf/addMiner', views.addMiner),
    path('dwarf/addMerchant', views.addMerchant),
    path('dwarf/addSoldier', views.addSoldier),
    path('dwarf/subtractMiner', views.subtractMiner),
    path('dwarf/subtractMerchant', views.subtractMerchant),
    path('dwarf/subtractSoldier', views.subtractSoldier),

    path('message', views.message),
    
    #=========== Leaderboard ===========#
    path('leaderboard/coin', views.leaderboardCoin),
    path('leaderboard/mana', views.leaderboardMana),
    path('leaderboard/mineral', views.leaderboardMineral),
    path('leaderboard/subscribe', views.leaderboardSubscribe),
    path('leaderboard/subscribe/coin', views.leaderboardSubscribeCoin),
    path('leaderboard/subscribe/mana', views.leaderboardSubscribeMana),
    path('leaderboard/subscribe/mineral', views.leaderboardSubscribeMineral),

    # ===== Skill ===== #
    path('skill/query_all_skills', views.queryAllSkills),
    path('skill/learn', views.learnSkill),
    path('skill/query_learned_skills', views.queryLearnedSkills),

    # ===== URL ===== #
    path('llm/chat', views.llmChat),
    path('llm/reset', views.llmReset),
]
