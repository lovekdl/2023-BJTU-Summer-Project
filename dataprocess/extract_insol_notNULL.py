# 选取pl_insol列非空的行
import pandas as pd

# 读取xlsx表格文件
df = pd.read_excel("../dataset/PSCompPars_2023.07.03_17.48.59.xlsx")

# 删除"pl_insol"列值为空或者是空字符串的行，以及“pl_rade”列不合法的行
df = df[df["pl_insol"].notna() & df["pl_rade"].notna()]
df = df[df["pl_insol"] >= 0]
# 将结果保存到一个新的表格文件
df.to_excel("../dataset/insol_notnull.xlsx", index=False)
