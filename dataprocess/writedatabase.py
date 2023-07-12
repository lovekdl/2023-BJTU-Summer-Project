import pandas as pd
import sqlalchemy

engine = sqlalchemy.create_engine('mysql+mysqlconnector://root:20021012@120.53.94.209:3306/bluespace')

df = pd.read_csv('../model/model-junior/combined_Exo-planets_with-label.csv')
df.to_sql('Exoplanets', con=engine, if_exists='replace', index=False, chunksize=5000)

