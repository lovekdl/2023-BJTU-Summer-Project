import pandas as pd

df = pd.read_excel("../dataset/Habitable_exoplanet.xlsx")

df["isHabitable"] = 1
df.to_excel("../dataset/Habitable_exoplanet_withlabel.xlsx")