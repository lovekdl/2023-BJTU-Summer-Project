# 将添加标签后的宜居星球数据与非宜居星球数据放入一个表格
import pandas as pd
df1 = pd.read_csv("../model/model-junior/Exo-planets(habitable).csv")
df2 = pd.read_csv("../model/model-junior/Exo-planets(Non-habitable).csv")

df3 = pd.concat([df1, df2], axis=0, join="outer")
df3.to_csv("../model/model-junior/combined_Exo-planets_with-label.csv", index=False)
