import pandas as pd


df1 = pd.read_excel("../dataset/output.xlsx")
df1.drop(df1.columns[[0, 1]], axis=1, inplace=True) # 删除前两列多余的索引
df1.dropna(axis=0, how='all', subset=None, inplace=True)# 删除全部为空的行
df1.to_excel("../dataset/concentrate_data")
