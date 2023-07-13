import numpy as np
import pandas as pd
import joblib
import json
import os
import pickle
from xgboost import XGBClassifier
from modelDNNLinearRegression.predictor import Predict8
# from model.model-DNN-LinearRegression.predictor import Predict8

class Predictor:
    '''
    预测器类，用于预测数据
    '''
    def __init__(self) -> None:
        self.model_senior = None
        self.model_junior = None
        self.data = None
        self.junior_needs = ["Orbit_period", "Semi_major_axis", "Mass (EU)", "Radius (EU)", 
                             "Stellar_luminosity", "Stellar_mass", "Stellar_radius"]
        self.senior_needs = ['rowid', 'pl_pnum', 'pl_orbper', 'pl_orbpererr1', 'pl_orbpererr2',
                             'pl_orbperlim', 'pl_orbsmaxlim', 'pl_radj', 'pl_radjerr1',
                             'pl_radjerr2', 'pl_radjlim', 'ra', 'dec', 'st_dist', 'st_disterr1',
                             'st_disterr2', 'st_optmag', 'gaia_gmag', 'st_teff', 'st_tefferr1',
                             'st_tefferr2', 'st_mass', 'st_masserr1', 'st_rad', 'st_raderr1',
                             'st_raderr2', 'pl_tranflag', 'pl_rvflag', 'pl_radelim', 'pl_radslim',
                             'pl_trandur', 'pl_trandurerr1', 'pl_trandurerr2', 'pl_tranmid',
                             'pl_tranmiderr1', 'pl_tranmiderr2', 'pl_st_npar', 'pl_st_nref',
                             'st_rah', 'st_glon', 'st_glat', 'st_elon', 'st_elat', 'gaia_plx',
                             'gaia_plxerr1', 'gaia_plxerr2', 'gaia_dist', 'gaia_disterr1',
                             'gaia_disterr2', 'st_pmra', 'st_pmraerr', 'st_pmdec', 'st_pmdecerr',
                             'st_pm', 'st_pmerr', 'gaia_pmra', 'gaia_pmraerr', 'gaia_pmdec',
                             'gaia_pmdecerr', 'gaia_pm', 'gaia_pmerr', 'st_logg', 'st_loggerr1',
                             'st_loggerr2', 'st_metfe', 'st_metfeerr1', 'st_metfeerr2', 'st_j',
                             'st_jerr', 'st_jlim', 'st_h', 'st_herr', 'st_hlim', 'st_k', 'st_kerr',
                             'st_klim', 'st_wise1', 'st_wise1err', 'st_wise1lim', 'st_wise2',
                             'st_wise2err', 'st_wise2lim', 'st_wise3', 'st_wise3err', 'st_wise3lim',
                             'st_wise4', 'st_wise4lim', 'st_jmh2', 'st_jmh2err', 'st_jmh2lim',
                             'st_hmk2', 'st_hmk2err', 'st_hmk2lim', 'st_jmk2', 'st_jmk2err',
                             'st_jmk2lim', 'habitable']
        self.dnn_needs = ["Orbit_period", "Semi_major_axis", "Mass (EU)", "Radius (EU)", 
                             "Stellar_luminosity", "Stellar_mass", "Stellar_radius", "ESI"]
        self.imputer = joblib.load('./modelsenior/model/imputer.joblib')
        self.scaler = joblib.load('./modelsenior/model/scaler.joblib')
        self.dnn_path = os.path.join(os.getcwd(), 'modelDNNLinearRegression\\models\\model.ckpt')
        with open('./modelsenior/model/NumericCols.pkl', 'rb') as f:
            self.NumericCols = pickle.load(f)
    
    def set_data(self, data):
        self.data = data
     
    def load_model(self, model_type : int):
        '''
        加载模型
        model_type : int 模型类型，1为高级模型，2为初级模型，3为DNN模型
        '''
        if model_type == 1:
            self.model_senior = XGBClassifier()
            self.model_senior.load_model('./modelsenior/model/xgb.model')
        elif model_type == 2:
            self.model_junior = joblib.load('./modeljunior/rf_model.pkl')
        else:
            pass
    
    def check(self, model_type : int):
        '''
        数据检查
        ret : int 检查结果，1为数据合法，0为数据不合法
        '''
        if self.data is None:
            return 0
        if model_type == 1:
            return 1
        elif model_type == 2:
            for field in self.junior_needs:
                if field not in self.data.columns:
                    return 0
                if self.data[field].isnull().any():
                    return 0
        else:
            for field in self.dnn_needs:
                if field not in self.data.columns:
                    return 0
                if self.data[field].isnull().any():
                    return 0
        return 1   
        
    def clearify(self, model_type : int):
        '''
        数据清洗
        model_type : int 模型类型，1为高级模型，2为初级模型
        '''
        if model_type == 1:
            
            for field in self.data.columns:
                if field not in self.senior_needs:
                    self.data = self.data.drop(field, axis=1) 
                    
            for field in self.senior_needs:
                if field not in self.data.columns:
                    self.data[field] = np.nan
                    
            self.data['habitable'] = np.nan
            self.data = self.data.set_index("rowid")
            
            # 填充缺失值
            self.data[self.data._get_numeric_data().columns] = self.imputer.transform(self.data[self.data._get_numeric_data().columns])
            
            # 标准化
            self.data[self.NumericCols] = self.scaler.transform(self.data[self.NumericCols])
            
            self.data = self.data.drop("habitable", axis = 1)
            
            
        elif model_type == 2:
            for field in self.data.columns:
                # print(field)
                if field not in self.junior_needs:
                    print("drop", field)
                    self.data = self.data.drop(field, axis=1)
                    
        else:
            for field in self.data.columns:
                # print(field)
                if field not in self.dnn_needs:
                    print("drop", field)
                    self.data = self.data.drop(field, axis=1)
          
    def predict(self, model_type : int, json_data):
        '''
        需要传入的参数：
        model_type : int 模型类型，1为高级模型，2为初级模型
        json_data : json 数据
        返回值：
        ret : 预测结果，1为可居住，0为不可居住, -1为错误, (0, 1)为可宜居概率
        '''
        self.data = json.loads(json_data)
        self.data = pd.DataFrame([self.data])
        if self.check(model_type) == 0:
            return -1
        self.clearify(model_type)
        
        if model_type == 1:
            if(self.model_senior is None):
                self.load_model(1)
            self.data = np.array(self.data).reshape(1, -1)
            y_preds = self.model_senior.predict(self.data)
            return y_preds[0]
        elif model_type == 2:
            if(self.model_junior is None):
                self.load_model(2)
            print(self.data)
            y_preds = self.model_junior.predict(self.data)
            return y_preds[0]
        else:
            self.data = list(self.data.values[0])
            print(self.data)
            return Predict8(self.data, self.dnn_path)
        
def main():
    '''
    测试样例
    '''
    predector = Predictor()
    
    junior_data = {
        "Planet_name": "Kepler-62 f",
        "Orbit_period": 267.291,
        "Semi_major_axis": 0.718,
        "Mass (EU)": 35,
        "Radius (EU)":  1.41,
        "Stellar_luminosity": -0.678, 
        "Stellar_mass": 0.69,
        "Stellar_radius": 0.64,
    }
    
    senior_data = {
        'rowid':1
    }
    
    dnn_data = {
        "Planet_name": "Kepler-62 f",
        "Orbit_period": 267.291,
        "Semi_major_axis": 0.718,
        "Mass (EU)": 35,
        "Radius (EU)":  1.41,
        "Stellar_luminosity": -0.678, 
        "Stellar_mass": 0.69,
        "Stellar_radius": 0.64,
        "ESI": 0.68
    }
    
    ## check功能测试
    # data = pd.DataFrame([data])
    # print(data)
    # predector.set_data(data)
    # print(predector.check(2))
    
    ## json数据测试
    json_data = json.dumps(dnn_data)
    # print(json_data)
    # data = json.loads(json_data)
    # data = pd.DataFrame([data])
    # print(data)
    
    ## predict功能测试
    y = predector.predict(3, json_data)
    print(y)
        
if __name__ == '__main__':
    main()