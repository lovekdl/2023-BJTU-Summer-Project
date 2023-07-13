import pandas as pd
import sqlalchemy

engine = sqlalchemy.create_engine('mysql+mysqlconnector://root:20021012@120.53.94.209:3306/bluespace')

df = pd.read_csv('../dataset/Simplified_planet_data.csv')
df.to_sql('SimplifiedPlanetData', con=engine, if_exists='replace', index=False, chunksize=5000)

