# 导入pandas库
import pandas as pd

# 读取excel表格
df = pd.read_excel("../dataset/combined_data_withlabel.xlsx")

# 获取表格的列数
ncols = df.shape[1]

# 创建一个空列表来存储要删除的列的名称
cols_to_drop = []

# 遍历每一列
for i in range(ncols):
    # 获取当前列的名称
    col_name = df.columns[i]
    # 获取当前列的非空值的个数
    non_na_count = df[col_name].count()
    # 获取当前列的总记录数
    total_count = df[col_name].size
    # 计算当前列的非空值占比
    ratio = non_na_count / total_count
    # 如果非空值占比小于0.5，即超过一半的记录都是na
    if ratio < 0.5:
        # 把这一列的名称添加到列表中
        cols_to_drop.append(col_name)

# 在循环结束后，用drop方法一次性删除列表中的所有列
df.drop(cols_to_drop, axis=1, inplace=True)

# 将删除后的dataframe写入一个新的excel表格
df.to_excel("../dataset/output.xlsx", index=False)
