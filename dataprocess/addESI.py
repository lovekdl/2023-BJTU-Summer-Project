import math
import numpy
import numpy as np
import pandas


# 定义ESI计算函数
def esi(s, r):
    s_e = 1.361  # kW/h
    r_e = 6371  # km
    p1 = ((s - s_e) / (s + s_e)) * ((s - s_e) / (s + s_e))
    p2 = ((r - r_e) / (r + r_e)) * ((r - r_e) / (r + r_e))
    esi = 1 - math.sqrt(0.5 * (p1 + p2))
    return esi

# 定义一个新的函数，捕获ZeroDivisionError异常，并为错误的ESI列赋-1值
def esi_safe(x):
    try:
        return esi(x["pl_insol"], x['pl_rade'] * 6371)
    except ZeroDivisionError:
        return -1


data = pandas.read_excel("../dataset/insol_notnull.xlsx")

# 在lambda表达式中调用新的函数
data["ESI"] = data.apply(lambda x: esi_safe(x), axis=1)

data.to_excel("../dataset/ESIresult.xlsx", index=False)
