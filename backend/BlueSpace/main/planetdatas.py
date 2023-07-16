# -*- coding: UTF-8 -*-
from django.http import HttpResponse

import sys
import json
import numpy as np
import pandas as pd
import random
import string

from .tools import Tools
from .models import *
from model.predictor import Predictor

# === Prediction === #
def junior_predict(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    data = json.loads(request.body)

    if 'token' not in data or data['token'] is None:
        return Tools.toErrorResponse('Token is none.')
    token = data['token']
    

    predictor = Predictor()
    
    #result = predictor.predict(2, str(data['features']).replace("'", "\""))
    r = predictor.predict(2, json.dumps(data['features']))
    
    if r == -1:
        return Tools.toErrorResponse('Prediction incorrect.')
    
    pr_result = ''
    esi = 0.42 
    if r == 1:
        pr_result = 'Habitable'
        esi = round(random.uniform(0.4, 0.8), 2)
    if r == 0:
        pr_result = 'NOT Habitable'
        esi = round(random.uniform(0.2, 0.5), 2)
        
    data['features']['ESI'] = 0.8
    data['features']['Orbit_period'] = float(data['features']['Orbit_period'])
    data['features']['Semi_major_axis'] = float(data['features']['Semi_major_axis'])
    data['features']['Mass (EU)'] = float(data['features']['Mass (EU)'])
    data['features']['Radius (EU)'] = float(data['features']['Radius (EU)'])
    data['features']['Stellar_luminosity'] = float(data['features']['Stellar_luminosity'])
    data['features']['Stellar_radius'] = float(data['features']['Stellar_radius'])
    data['features']['Stellar_mass'] = float(data['features']['Stellar_mass'])
    
    result['state'] = 'success'
    result['predict_hb'] = pr_result
    result['predict_hbrate'] = "{:.2f}".format(float(predictor.predict(3, json.dumps(data['features']))))
    result['esi'] = esi
    print(result)
    return Tools.toResponse(result, 200)

def senior_predict(request):
    result = {}
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    data = json.loads(request.body)

    if 'token' not in data or data['token'] is None:
        return Tools.toErrorResponse('Token is none.')
    token = data['token']
    

    predictor = Predictor()
    
    r = predictor.predict(1, request.body)
    
    if r == -1:
        return Tools.toErrorResponse('Prediction incorrect.')
    
    result['predict_result'] = str(r)
    
    return Tools.toResponse(result, 200)

def getHabitableRate(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    random_rate = random.random()
    rounded_rate = round(random_rate, 2)  # 限制小数位数为两位
    result['habitable_rate'] = rounded_rate
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    
def getResource(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
        
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject 
    
    planets = SimpData.objects.values('pl_name', 'id', 'orbit_period', 'semi_major_axis', 'radius_eu_field', 'mass_eu_field', 'stellar_radius', 'stellar_mass', 'stellar_luminosity', 'esi', 'ishabitable')
    result = [{
    'Planet_name': planet['pl_name'],
    'key': planet['id'],
    'Semi_major_axis': planet['semi_major_axis'],
    'Mass': planet['mass_eu_field'],
    'Radius': planet['radius_eu_field'],
    'Stellar_luminosity': planet['stellar_luminosity'],
    'Stellar_mass': planet['stellar_mass'],
    'Stellar_radius': planet['stellar_radius'],
    'esi': round(float(planet['esi']), 2),
    'habitable': 'Habitable' if planet['ishabitable'] == 1 else 'NOT Habitable',
    'Orbit_period': round(float(planet['orbit_period']), 2)
} for planet in planets]
    return Tools.toResponse(result, 200)

def getHabitableProportion(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    
def viewSaves(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
    
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject 
    data = json.loads(request.body)    
    
    planets = UserCreatedPlanets.objects.filter(token=data['token'])
    result = [
    {
        'Planet_name': planet.planet_name,
        'Orbit_period': planet.orbit_period,
        'id': planet.id,
        'key': planet.id,
        'Semi_major_axis': planet.semi_major_axis,
        'Mass': planet.mass_eu_field,
        'Radius': planet.radius_eu_field,
        'Stellar_luminosity': planet.stellar_luminosity,
        'Stellar_mass': planet.stellar_mass,
        'Stellar_radius': planet.stellar_radius,
        'esi': planet.esi,
        'habitable': planet.habitable
    }
    for planet in planets
]
    return Tools.toResponse(result, 200)

def delPrediction(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
      
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject  

    data = json.loads(request.body)
    
    pl_todel = UserCreatedPlanets.objects.get(id=data['id'])
    pl_todel.delete()
    
    result['state'] = 'success'
    return Tools.toResponse(result, 200)
    
    

def savePrediction(request):
    result = {}
    
    if request.method != 'POST':
        return Tools.toErrorResponse('Request method is not POST.')
      
    state, someObject = Tools.verifyToken(request=request)
    if state:
        user = someObject
    else:
        return someObject  
    
    data = json.loads(request.body)
    if data['habitable'] == 'Habitable':
        hb = 1
    else:
        hb = 0
    planet0 = UserCreatedPlanets(token=data['token'], planet_name=data['Planet_name'], orbit_period=data['features']['Orbit_period'], semi_major_axis=data['features']['Semi_major_axis'], mass_eu_field=data['features']['Mass'], radius_eu_field=data['features']['Radius'], stellar_luminosity=data['features']['Stellar_luminosity'], stellar_mass=data['features']['Stellar_mass'], stellar_radius=data['features']['Stellar_radius'], esi=data['esi'], habitable=data['habitable'])
    planet1 = SimpData(pl_name=data['Planet_name'], orbit_period=data['features']['Orbit_period'], semi_major_axis=data['features']['Semi_major_axis'], mass_eu_field=data['features']['Mass'], radius_eu_field=data['features']['Radius'], stellar_luminosity=data['features']['Stellar_luminosity'], stellar_mass=data['features']['Stellar_mass'], stellar_radius=data['features']['Stellar_radius'], esi=float(data['esi']), ishabitable=hb)
    planet0.save()
    planet1.save()
    
    result['state'] = 'success'
    return Tools.toResponse(result, 200)