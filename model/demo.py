import numpy as np
import pandas as pd
import json

import predictor

def main():
    predic = predictor.Predictor()
    
    test_data_junior = {
        "Planet_name": "Kepler-10 b",
        "Orbit_period": 59.877560,
        "Semi_major_axis": 0.248610,
        "Mass (EU)": 5.27,
        "Radius (EU)":  2.150,
        "Stellar_luminosity": -0.923, 
        "Stellar_mass": 0.64,
        "Stellar_radius": 0.62
    }
    test_data_junior = json.dumps(test_data_junior)
        
    test_data_senior = {
        "pl_name":1
    }
    test_data_senior = json.dumps(test_data_senior)
    
    print(predic.predict(1, test_data_senior))
    print(predic.predict(1, test_data_junior))
    

if __name__ == '__main__':
    main()
    
    