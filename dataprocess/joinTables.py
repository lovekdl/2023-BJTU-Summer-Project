# 将添加标签后的宜居星球数据与非宜居星球数据放入一个表格
import pandas as pd
df1 = pd.read_excel("../dataset/Habitable_exoplanet_withlabel.xlsx")
df2 = pd.read_excel("../dataset/Unhabitable_exoplanet_withlabel.xlsx")

df3 = pd.concat([df1, df2], axis=0, join="outer")
df3.to_excel("../dataset/combined_data_withlabel.xlsx")
