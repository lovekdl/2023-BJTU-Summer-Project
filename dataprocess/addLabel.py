# 为数据添加标签，0代表非宜居，1代表宜居
import pandas as pd

df = pd.read_excel("../dataset/Habitable_exoplanet.xlsx")

df["isHabitable"] = 1
df.to_excel("../dataset/Habitable_exoplanet_withlabel.xlsx")