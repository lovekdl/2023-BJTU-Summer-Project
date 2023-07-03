from django.http import HttpResponse

import json

from .tools import Tools
from .models import *
from .constants import *

# ===== Catalog ===== #
# Dwarf:        雇佣矮人、改变矮人职业
# Resource:     获取玩家资源
# Account:      登录、注册
# Message：     欢迎信息
# Leaderboard:  排行榜
# Skill:        学习技能，查看所有技能，查看某个玩家学习技能的情况
# LLM:          大语言模型支持

from .minecraft_llm_support_backend.mcllm_backend import McllmBackend
mcllm_backend = McllmBackend()

# ===== Dwarf ===== #
# 雇佣矮人
def employ(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    # dwarf
    dwarf = player.employ_dwarf()
    
    if dwarf is None:
        return Tools.toErrorResponse("You don't have enough coins.")

    # result
    with dwarf.lock:
        result = {
            "state": "success",
            "firstname": str(dwarf.firstname),
            "secondname": str(dwarf.secondname),
            "sex": dwarf.sex,
            "strength": dwarf.strength,
            "dexterity": dwarf.dexterity,
            "constitution": dwarf.constitution,
            "intelligence": dwarf.intelligence,
            "wisdom": dwarf.wisdom,
            "charisma": dwarf.charisma,
            "message": MESSAGE_EMPLOY_DWARF.copy(),
        }
        result["message"][0] = result["message"][0].format(
            firstname = str(dwarf.firstname),
            secondname = str(dwarf.secondname),
            sex = "男性" if dwarf.sex == 0 else "女性",
            ta = "他" if dwarf.sex == 0 else "她",
            strength = dwarf.strength,
            dexterity = dwarf.dexterity,
            constitution = dwarf.constitution,
            intelligence = dwarf.intelligence,
            wisdom = dwarf.wisdom,
            charisma = dwarf.charisma,
        )

    return Tools.toResponse(result, 200)

# 增加矿工
def addMiner(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    return modifyDwarfJob(player=player, origin=DWARF_JOB_IDLE, target=DWARF_JOB_MINER)

# 减少矿工
def subtractMiner(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    return modifyDwarfJob(player=player, origin=DWARF_JOB_MINER, target=DWARF_JOB_IDLE)

# 增加商人
def addMerchant(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    return modifyDwarfJob(player=player, origin=DWARF_JOB_IDLE, target=DWARF_JOB_MERCHANT)

# 减少商人
def subtractMerchant(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    return modifyDwarfJob(player=player, origin=DWARF_JOB_MERCHANT, target=DWARF_JOB_IDLE)

# 增加佣兵
def addSoldier(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    return modifyDwarfJob(player=player, origin=DWARF_JOB_IDLE, target=DWARF_JOB_SOLDIER)

# 减少佣兵
def subtractSoldier(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    return modifyDwarfJob(player=player, origin=DWARF_JOB_SOLDIER, target=DWARF_JOB_IDLE)

# 修改矮人职业
# @param player 矮人所属玩家
# @param origin 矮人原职业
# @param target 矮人目标职业
# @return 结果Response
def modifyDwarfJob(player, origin, target):
    valid_dwarfs = Dwarf.objects.filter(player=player, job=origin)
    if valid_dwarfs.count() == 0:
        return Tools.toErrorResponse("Origin job dwarf isn't enough.")
    else:
        result = {"state": "success"}
        result["message"] = MESSAGE_MODIFY_DWARF_JOB.copy()
        dwarf = valid_dwarfs.first()
        with dwarf.lock:
            dwarf.job = target # TODO 
            dwarf.save()
            result["message"][0] = result["message"][0].format(
                firstname = str(dwarf.firstname),
                secondname = str(dwarf.secondname),
                newjob = DWARF_JOB_REFLECTION[target]
            )
        return Tools.toResponse(result, 200)

# ===== Resource ===== #
def resource(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject
    # get resource
    result = {}

    with user.lock:
        result['state'] = 'success'
        result['mana'] = user.mana
        result['coin'] = user.coin
        result['mineral'] = user.mineral

        result['dwarf'] = user.dwarf
        result['miner'] = user.miner
        result['merchant'] = user.merchant
        result['soldier'] = user.soldier

    return Tools.toResponse(result, 200)

# ===== Account ===== #
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

    users = Player.objects.filter(username=username)

    if users.count() == 0:
        if auto_create_account == False:
            return Tools.toErrorResponse('Username doesn\'t exist.')
        user = Player(username=username, password=password)
        user.save()
    else:
        if auto_create_account == True:
            return Tools.toErrorResponse('Username exists.')
        user = users.first()

    with user.lock:
        if user.password != password:
            return Tools.toErrorResponse('Password is incorrect.')

    result['state'] = 'success'
    result['token'] = Tools.encode(username, password)

    return Tools.toResponse(result, 200)

# ===== Message ===== #
def message(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject

    result = {
        "state": "success",
    }
    with player.lock:
        if player.story_process <= 1:
            player.story_process += 1
            result["message"] = MESSAGE_ENTER_FIRST_TIME.copy()
        else:
            result["message"] = MESSAGE_ENTER.copy()
        player.save()
    
    return Tools.toResponse(result, 200)

# ===== Leaderboard ===== #
def leaderboardCoin(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    result = {
        "state": "success",
    }
    
    rank = Player.objects.order_by('-coin')
    following_players = player.following.all()
    for i in range(0, len(rank)):
        with rank[i].lock:  
            result["rank" + str(i+1)] = {
                "UID": rank[i].ID,
                "totalrank": i+1,
                "username": rank[i].username,
                "coin": rank[i].coin,
                "following": "true" if rank[i] in following_players 
                                    or rank[i] == player else "false",
            }
    
    return Tools.toResponse(result, 200)

def leaderboardMana(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    result = {
        "state": "success",
    }
    
    rank = Player.objects.order_by('-mana')
    following_players = player.following.all()
    for i in range(0, len(rank)):
        with rank[i].lock:
            result["rank" + str(i+1)] = {
                "UID": rank[i].ID,
                "totalrank": i+1,
                "username": rank[i].username,
                "mana": rank[i].mana,
                "following": "true" if rank[i] in following_players 
                                    or rank[i] == player else "false",
            }
    
    return Tools.toResponse(result, 200)

def leaderboardMineral(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    result = {
        "state": "success",
    }
    
    rank = Player.objects.order_by('-mineral')
    following_players = player.following.all()
    for i in range(0, len(rank)):
        with rank[i].lock: 
            result["rank" + str(i+1)] = {
                "UID": rank[i].ID,
                "totalrank": i+1,
                "username": rank[i].username,
                "mineral": rank[i].mineral,
                "following": "true" if rank[i] in following_players 
                                    or rank[i] == player else "false",
            }
    
    return Tools.toResponse(result, 200)

def leaderboardSubscribe(request):
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    with player.lock:
        follower = player
        
        data = json.loads(request.body)
        if 'followed' not in data or data['followed'] is None:
            return False, Tools.toErrorResponse('followed is none.')
        
        followed_id = data['followed']
        if Player.objects.filter(ID=followed_id).count() == 0:
            return Tools.toErrorResponse("Followed player doesn't exist.")
        
        print(followed_id)
        
        result = {
            "state": "success",
        }
        
        followed = Player.objects.get(ID=followed_id)
        
        if follower != followed:  # 避免自己关注自己
            if follower.following.filter(ID=followed_id).exists():
                follower.following.remove(followed)
                result["message"] = "successfully unsubscribe"
            else:
                follower.following.add(followed)
                result["message"] = "successfully subscribe"
        else:
            result["message"] = "You always follow yourself. \
                                 You are the only one who can own the power of ScarletMana!"
    
    return Tools.toResponse(result, 200)
    
def leaderboardSubscribeCoin(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    result = {
        "state": "success",
    }
    
    rank = Player.objects.order_by('-coin')
    following_players = player.following.all()
    cnt = 0
    for i in range(0, len(rank)):
        with rank[i].lock:
            if rank[i] in following_players or rank[i] == player:
                cnt += 1
                result["rank" + str(cnt)] = {
                    "UID": rank[i].ID,
                    "totalrank": i+1,
                    "username": rank[i].username,
                    "coin": rank[i].coin,
                    "following": "true" if rank[i] in following_players
                                        or rank[i] == player else "false",
                }
    
    return Tools.toResponse(result, 200)

def leaderboardSubscribeMana(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject

    result = {
        "state": "success",
    }
    
    rank = Player.objects.order_by('-mana')
    following_players = player.following.all()
    cnt = 0
    for i in range(0, len(rank)):
        with rank[i].lock:
            if rank[i] in following_players or rank[i] == player:
                cnt += 1
                result["rank" + str(cnt)] = {
                    "UID": rank[i].ID,
                    "totalrank": i+1,
                    "username": rank[i].username,
                    "mana": rank[i].mana,
                    "following": "true" if rank[i] in following_players
                                        or rank[i] == player else "false",
                }
    
    return Tools.toResponse(result, 200)

def leaderboardSubscribeMineral(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    result = {
        "state": "success",
    }
    
    rank = Player.objects.order_by('-mineral')
    following_players = player.following.all()
    cnt = 0
    for i in range(0, len(rank)):
        with rank[i].lock:
            if rank[i] in following_players or rank[i] == player:
                cnt += 1
                result["rank" + str(cnt)] = {
                    "UID": rank[i].ID,
                    "totalrank": i+1,
                    "username": rank[i].username,
                    "mineral": rank[i].mineral,
                    "following": "true" if rank[i] in following_players
                                        or rank[i] == player else "false",
                }
    
    return Tools.toResponse(result, 200)

# ===== Skill ===== #
# 查询所有技能
def queryAllSkills(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    
    result = {
        "state": "success",
        "data": [],
    }

    skills = Skill.objects.all()
    
    for skill in skills:
        with skill.lock:
            dic = {
                "id": skill.ID,
                "name": skill.name,
                "effect_describe": skill.effect_describe,
                "background_describe": skill.background_describe,
                "precondition": skill.precondition,
            }
            if skill.mana_cost > 0: dic["mana_cost"] = skill.mana_cost
            if skill.coin_cost > 0: dic["coin_cost"] = skill.coin_cost
            if skill.mineral_cost > 0: dic["mineral_cost"] = skill.mineral_cost
            if skill.dwarf_limit > 0: dic["dwarf_limit"] = skill.dwarf_limit
            result["data"].append(dic)
    
    return Tools.toResponse(result, 200)

# 学习某个技能
def learnSkill(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject
    target_skill_id = json.loads(request.body)["skill_id"]

    target_skill = Skill.objects.filter(ID=target_skill_id)
    if target_skill.count() <= 0:
        return Tools.toErrorResponse("Skill not found.")
    else:
        target_skill = target_skill[0]

    learned_skills = SkillLearn.objects.filter(player=player, skill=target_skill)

    if learned_skills.count() > 0:
        return Tools.toErrorResponse("Skill has been learned.")
    
    skillLearn = SkillLearn(player=player, skill=target_skill)
    # 下面这个learn方法包含了save的作用，不需要再手动save
    # 如果条件不足以学习，则不会改变数据，也不会save
    # 具体参见该函数的注释
    # 这里因为skillLearn这个记录，尚未被save，所以不可能被其他线程读取，所以不用加锁
    learn_result = skillLearn.learn()
    if learn_result != "success":
        return Tools.toErrorResponse(learn_result)

    result = {"state": "success"}

    return Tools.toResponse(result, 200)

    
# 查询一个玩家学习的所有技能ID
def queryLearnedSkills(request):
    # verify token
    state, someObject = Tools.verifyToken(request=request)
    if state:
        player = someObject
    else:
        return someObject

    result = {
        "state": "success",
        "learned_skills": [],
    }

    learned_skills = SkillLearn.objects.filter(player=player)

    for learned_skill in learned_skills:
        with learned_skill.lock:
            with learned_skill.skill.lock:
                result["learned_skills"].append(learned_skill.skill.ID)
    result["learned_skills"].sort()
    
    return Tools.toResponse(result, 200)

# ===== LLM ===== #
def llmChat(request):
    data = json.loads(request.body)

    if "username" not in data or data["username"] is None:
        return Tools.toErrorResponse("Not found username.")
    if "target" not in data or data["target"] is None:
        return Tools.toErrorResponse("Not found target.")
    if "message" not in data or data["message"] is None:
        return Tools.toErrorResponse("Not found message.")
    
    response = mcllm_backend.query(data["username"], data["target"], data["message"])

    result = {
        "state": "success",
        "message": response,
    }

    print("Request: ", data, "\nResponse: ", result)

    return Tools.toResponse(result, 200)

def llmReset(request):
    mcllm_backend.reset()

    result = {
        "state": "success",
        "message": "reset success",
    }

    return Tools.toResponse(result, 200)
