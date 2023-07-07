# 行星宜居度预测用户版

## 1. 简介

这是一个行星宜居度预测的弱化版模型，只需要极少的数据就可以较高准确率的预测一颗行星是否宜居。但是因为所需的数据太少，模型考虑的周全度和准确度必然不如大模型。

## 2. 所需要的数据（不可缺省）

1. Orbit_period : Orbital Period [days] 行星轨道周期
2. Semi_major_axis : Orbit Semi-Major Axis [AU] 行星轨道的半长轴长度
3. Mass (EU) : Planet Mass [Earth mass] 行星质量
4. Radius (EU) : Planet Radius [Earth radii] 行星半径
5. Stellar_luminosity : Stellar Luminosity [log(Solar)] 所属恒星光度
6. Stellar_mass : Stellar Mass [Solar mass] 所属恒星质量
7. Stellar_radius :  Stellar Radius [Solar radii] 所属恒星半径

## 3. 如何使用