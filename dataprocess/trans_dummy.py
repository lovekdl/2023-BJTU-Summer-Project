import pandas as pd

data = pd.read_excel()

one_hot_data = pd.get_dummies(data)
# one_hot_data是一个新的数据集，其中所有字符类型的列都被转换为独热编码的形式
# 您可以查看one_hot_data的列名和内容
print(one_hot_data.columns)
print(one_hot_data.head())
