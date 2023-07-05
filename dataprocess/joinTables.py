import pandas as pd
df1 = pd.read_excel("../dataset/Habitable_exoplanet_withlabel.xlsx")
df2 = pd.read_excel("../dataset/Unhabitable_exoplanet_withlabel.xlsx")

df3 = pd.concat([df1, df2], axis=0, join="outer")
df3.to_excel("../dataset/combined_data_withlabel.xlsx")
