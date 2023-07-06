import pandas as pd

data = pd.read_excel("../dataset/concentrate_data.xlsx")

one_hot_data = pd.get_dummies(data)
# one_hot_data是一个新的数据集，其中所有字符类型的列都被转换为独热编码的形式

one_hot_data.to_csv("../dataset/dummydata.txt", sep='\t')