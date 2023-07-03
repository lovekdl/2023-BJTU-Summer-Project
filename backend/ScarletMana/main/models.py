from typing import Any
from django.db import models
from django.conf import settings
from django.db.models.base import ModelState

import random
import threading
import math

from .constants import *

# ===== Catalog ===== #
# Player
# DwarfFirstname
# DwarfSecondname
# Dwarf
# Skill
# SkillLearn

class Player(models.Model):
    # ===== Constructor =====
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.lock = threading.Lock()
    
    # ===== Property =====
    ID = models.AutoField(primary_key=True)

    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)

    title = models.CharField(max_length=20, null=True, blank=True)
    motto = models.CharField(max_length=50, null=True, blank=True)

    mana = models.IntegerField(default=0)
    coin = models.IntegerField(default=0)
    mineral = models.IntegerField(default=0)
    
    #关注
    following = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='followers')

    # Harvest
    mana_harvest_base = models.IntegerField(default=0)
    mana_harvest_multiple = models.IntegerField(default=1)
    mana_harvest_interval = models.IntegerField(default=10)
    mana_harvest_count = models.IntegerField(default=0)

    coin_harvest_base = models.IntegerField(default=1)
    coin_harvest_multiple = models.IntegerField(default=2)
    coin_harvest_interval = models.IntegerField(default=10)
    coin_harvest_count = models.IntegerField(default=0)

    mineral_harvest_base = models.IntegerField(default=0)
    mineral_harvest_multiple = models.IntegerField(default=1)
    mineral_harvest_interval = models.IntegerField(default=10)
    mineral_harvest_count = models.IntegerField(default=0)

    dwarf_harvest_base = models.IntegerField(default=0)
    # dwarf_harvest_multiple = models.IntegerField() # Useless
    dwarf_harvest_interval = models.IntegerField(default=600) # default=10min
    dwarf_harvest_count = models.IntegerField(default=0)

    # 雇佣矮人价格
    employ_dwarf_price = models.IntegerField(default=EMPLOY_DWARF_PRICE)
    employ_dwarf_salary = models.FloatField(default=EMPLOY_DWARF_SALARY) # 注意，矮人工资是float

    # 剧情进度
    story_process = models.IntegerField(default=0)

    # Temp Variables
    temp_sold_minerals = models.IntegerField(default=0,null=True,blank=True)

    # 矮人及各职业矮人数量
    @property
    def dwarf(self):
        return Dwarf.objects.filter(player=self).count()

    @property
    def idle(self):
        return Dwarf.objects.filter(player=self, job=DWARF_JOB_IDLE).count()

    @property
    def miner(self):
        return Dwarf.objects.filter(player=self, job=DWARF_JOB_MINER).count()
    
    @property
    def merchant(self):
        return Dwarf.objects.filter(player=self, job=DWARF_JOB_MERCHANT).count()
    
    @property
    def soldier(self):
        return Dwarf.objects.filter(player=self, job=DWARF_JOB_SOLDIER).count()

    # ===== Methods =====
    def __str__(self):
        return self.username

    # 刷新资源 - 储存
    def refresh_resource(self):
        self.mana_harvest()
        self.coin_harvest()
        self.mineral_harvest()
        self.dwarf_harvest()
    
    # 收获法力
    def mana_harvest(self):
        if self.mana_harvest_count > 0:
            self.mana_harvest_count -= 1
        else:
            self.mana_harvest_count = self.mana_harvest_interval
            self.mana += self.mana_harvest_base + self.mana_harvest_multiple * self.soldier
        self.save()
    
    # 收获金币 (要在收获矿物前被调用，因为商人卖矿物产出金币，会更新缓存变量temp_sold_minerals)
    # 金币 += 基本产出 + 倍数 * 商人数
    # 金币 -= ceil(矮人数 * 工资倍数)
    def coin_harvest(self):
        if self.coin_harvest_count > 0:
            self.coin_harvest_count -= 1
        else:
            self.coin_harvest_count = self.coin_harvest_interval
            self.temp_sold_minerals = min(self.mineral, self.merchant)
            self.coin += self.coin_harvest_base + self.coin_harvest_multiple * self.temp_sold_minerals
            self.coin -= math.floor(self.dwarf * self.employ_dwarf_salary)
            self.coin = max(self.coin, 0)
        self.save()

    # 收获矿物
    # 矿物 += 基本产出 + 倍数 * 矿工数
    # 矿物 -= 商人数
    def mineral_harvest(self):
        if self.mineral_harvest_count > 0:
            self.mineral_harvest_count -= 1
        else:
            self.mineral_harvest_count = self.mineral_harvest_interval
            self.mineral += self.mineral_harvest_base + self.mineral_harvest_multiple * self.miner
            self.mineral -= self.temp_sold_minerals
            self.mineral = max(self.mineral, 0)
        self.save()
    
    # 收获矮人
    # 需要有特殊科技才可以触发，默认base=0
    # TODO：收获矮人信息提示还没写
    def dwarf_harvest(self):
        if self.dwarf_harvest_count > 0:
            self.dwarf_harvest_count -= 1
        else:
            self.dwarf_harvest_count = self.dwarf_harvest_interval
            for i in range(self.dwarf_harvest_base):
                dwarf = Dwarf.Create(self)
                dwarf.save()
                # TODO: birth dwarf message
        self.save()
    
    # 雇佣矮人
    def employ_dwarf(self):
        if self.coin < self.employ_dwarf_price:
            return None
        self.coin -= self.employ_dwarf_price
        self.save()
        dwarf = Dwarf.Create(self)
        dwarf.save()
        return dwarf
    
class DwarfFirstname(models.Model):
    # ===== Constructor =====
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.lock = threading.Lock()
    
    # ===== Property =====
    ID = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.firstname

class DwarfSecondname(models.Model):
    # ===== Constructor =====
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.lock = threading.Lock()
    
    # ===== Property =====
    ID = models.AutoField(primary_key=True)
    secondname = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.secondname

class Dwarf(models.Model):
    # ===== Constructor =====
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.lock = threading.Lock()
    
    # ===== Property =====
    ID = models.AutoField(primary_key=True)

    # 在使用以下两个外键时，请将类型转换为str再输出
    # 例：str(firstname)
    firstname = models.ForeignKey("DwarfFirstname", on_delete=models.PROTECT)
    secondname = models.ForeignKey("DwarfSecondname", on_delete=models.PROTECT)
    sex = models.BooleanField(default=0) # 0 male; 1 female

    strength = models.IntegerField() # measuring physical power
    dexterity = models.IntegerField() # measuring agility
    constitution = models.IntegerField() # measuring endurance
    intelligence = models.IntegerField() # measuring reasoning and memory
    wisdom = models.IntegerField() # measuring perception and insight
    charisma = models.IntegerField() # measuring force of personality

    player = models.ForeignKey("Player", on_delete=models.PROTECT)
    job = models.IntegerField(default=DWARF_JOB_IDLE)

    def __str__(self):
        return str(self.firstname) + " " + str(self.secondname) + " employed by " + str(self.player)

    @staticmethod
    def Create(player: Player):
        # 默认以系统时间为种子
        random.seed()
        # print(time.perf_ounter())

        if DwarfFirstname.objects.count() == 0:
            return None
        if DwarfSecondname.objects.count() == 0:
            return None
        firstnameID = random.randint(1, DwarfFirstname.objects.count())
        secondnameID = random.randint(1, DwarfSecondname.objects.count())

        # print(firstnameID, ", ", secondnameID)

        dwarf = Dwarf(
            firstname=DwarfFirstname.objects.get(ID=firstnameID),
            secondname=DwarfSecondname.objects.get(ID=secondnameID),
            sex = int(random.randint(0, 1)),
            
            strength=random.randint(5, 15),
            dexterity=random.randint(5, 15),
            constitution=random.randint(5, 15),
            intelligence=random.randint(5, 15),
            wisdom=random.randint(5, 15),
            charisma=random.randint(5, 15),

            player=player
        )

        return dwarf

class Skill(models.Model):
    # ===== Constructor =====
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.lock = threading.Lock()
    
    # ===== Property =====
    # ATTENTION! Here, ID is IntegerField instead of AutoField
    # ID must >= 1
    ID = models.IntegerField(primary_key=True)

    # Describe
    name = models.CharField(max_length=20)
    effect_describe = models.CharField(default="", max_length=200)
    background_describe = models.CharField(default="", max_length=200)

    # Precondition: if precondition is 0, it has no precondition
    precondition = models.IntegerField(default=0)

    # Cost
    mana_cost = models.IntegerField(default=0)
    coin_cost = models.IntegerField(default=0)
    mineral_cost = models.IntegerField(default=0)
    dwarf_limit = models.IntegerField(default=0)
    # idle_limit = models.IntegerField(default=0)
    # miner_limit = models.IntegerField(default=0)
    # merchant_limit = models.IntegerField(default=0)
    # soldier_limit = models.IntegerField(default=0)

    # Buff
    mana_harvest_base_increase = models.IntegerField(default=0)
    mana_harvest_multiple_increase = models.IntegerField(default=0)
    mana_harvest_interval_decrease = models.IntegerField(default=0)

    coin_harvest_base_increase = models.IntegerField(default=0)
    coin_harvest_multiple_increase = models.IntegerField(default=0)
    coin_harvest_interval_decrease = models.IntegerField(default=0)

    mineral_harvest_base_increase = models.IntegerField(default=0)
    mineral_harvest_multiple_increase = models.IntegerField(default=0)
    mineral_harvest_interval_decrease = models.IntegerField(default=0)

    dwarf_harvest_base_increase = models.IntegerField(default=0)
    dwarf_harvest_interval_decrease = models.IntegerField(default=0)

    employ_dwarf_price_decrease = models.IntegerField(default=0)
    employ_dwarf_salary_decrease = models.FloatField(default=0)

    # Tag (for something special effect)
    tag = models.CharField(default="", null=True, blank=True, max_length=20)

    # ===== Methods =====
    def __str__(self):
        return str(self.ID) + "." + self.name

class SkillLearn(models.Model):
    # ===== Constructor =====
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.lock = threading.Lock()

    # ===== Property =====
    ID = models.AutoField(primary_key=True)

    player = models.ForeignKey("Player", on_delete=models.PROTECT)
    skill = models.ForeignKey("Skill", on_delete=models.PROTECT)

    # ===== Methods =====
    def __str__(self):
        return str(self.player) + " learned " + str(self.skill)
    
    # 这个方法会检查self.player是否可以学习self.skill
    # 如果可以学习，则进行学习，修改player的参数，并且将自己保存save()，并且返回"success"
    # 如果不可以学习，则不会执行任何内容，并且返回一个str，表示错误原因
    def learn(self) -> str:
        # 1. Check Condition State

        # Get learned skills
        skillLearns = SkillLearn.objects.filter(player=self.player)
        learned_skills = set()
        for skillLearn in skillLearns:
            with skillLearn.lock:
                with skillLearn.skill.lock:
                    learned_skills.add(skillLearn.skill.ID)
        # Check precondition
        with self.skill.lock:
            if self.skill.precondition != 0 and self.skill.precondition not in learned_skills:
                return "You haven't yet learned the prerequisite skill for this skill."
        
        # Type check
        self.skill: Skill
        self.player: Player

        # Cost
        with self.skill.lock:
            with self.player.lock:
                if self.player.mana < self.skill.mana_cost:
                    return "You don't have enough mana."
                if self.player.coin < self.skill.coin_cost:
                    return "You don't have enough coin." + (str(self.player.coin) + "|" + str(self.skill.coin_cost) if DEBUG_MODE_SKILL else "")
                if self.player.mineral < self.skill.mineral_cost:
                    return "You don't have enough mineral."
                if self.player.dwarf < self.skill.dwarf_limit:
                    return "You don't have enough dwarfs."
                # if self.player.idle < self.skill.idle_limit:
                #     return "You don't have enough idle dwarf."
                # if self.player.miner < self.skill.miner_limit:
                #     return "You don't have enough miner dwarf."
                # if self.player.merchant < self.skill.merchant_limit:
                #     return "You don't have enough merchant dwarf."
                # if self.player.soldier < self.skill.soldier_limit:
                #     return "You don't have enough soldier dwarf."
        
        self.save()

        # 2. Apply Change State
        with self.skill.lock:
            with self.player.lock:
                self.player.mana -= self.skill.mana_cost
                self.player.coin -= self.skill.coin_cost
                self.player.mineral -= self.skill.mineral_cost

                self.player.mana_harvest_base += self.skill.mana_harvest_base_increase
                self.player.mana_harvest_multiple += self.skill.mana_harvest_multiple_increase
                self.player.mana_harvest_interval -= self.skill.mana_harvest_interval_decrease

                self.player.coin_harvest_base += self.skill.coin_harvest_base_increase
                self.player.coin_harvest_multiple += self.skill.coin_harvest_multiple_increase
                self.player.coin_harvest_interval -= self.skill.coin_harvest_interval_decrease

                self.player.mineral_harvest_base += self.skill.mineral_harvest_base_increase
                self.player.mineral_harvest_multiple += self.skill.mineral_harvest_multiple_increase
                self.player.mineral_harvest_interval -= self.skill.mineral_harvest_interval_decrease

                self.player.dwarf_harvest_base += self.skill.dwarf_harvest_base_increase
                self.player.dwarf_harvest_interval -= self.skill.dwarf_harvest_interval_decrease

                self.player.employ_dwarf_price -= self.skill.employ_dwarf_price_decrease
                self.player.employ_dwarf_salary -= self.skill.employ_dwarf_salary_decrease

                self.player.save()

        return "success"