
import * as React from "react";
import { RefObject,useState,useRef } from "react";
import { Reorder } from "framer-motion";
import { observer } from 'mobx-react-lite';
import { motion } from "framer-motion";
import { Item } from "./Item";
import {useStore} from "../store/index"
import {message} from "antd"
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import { http } from "../utils/http.tsx";


function InnerPrediction() {
  const [count, setCount] = useState(0);
  const {PredictionStore} = useStore();
  const Planet_name = useRef<HTMLInputElement>(null);
  const Orbit_period = useRef<HTMLInputElement>(null);
  const Semi_major_axis = useRef<HTMLInputElement>(null);
  const Mass = useRef<HTMLInputElement>(null);
  const Radius = useRef<HTMLInputElement>(null);
  const Stellar_luminosity = useRef<HTMLInputElement>(null);
  const Stellar_mass = useRef<HTMLInputElement>(null);
  const Stellar_radius = useRef<HTMLInputElement>(null);
  const {t,i18n} = useTranslation()
  
  const handlePredictClicked = () => {
    console.log(Planet_name.current?.value)
    if(!Planet_name.current?.value|| !Orbit_period.current?.value|| !Semi_major_axis.current?.value|| !Mass.current?.value||!Radius.current?.value||!Stellar_luminosity.current?.value||!Stellar_mass.current?.value||!Stellar_radius.current?.value) {
      message.error(t('inputs can not be empty'))
      return;
    }
    for(const element of PredictionStore.items) {
      if(element.name == Planet_name.current?.value) {
        message.error('Repeated name')
        return;
      }
    }



    async function Predict() {
      try {
        let features = {
          Orbit_period:Orbit_period.current?.value,
          Semi_major_axis:Semi_major_axis.current?.value,
          "Mass (EU)":Mass.current?.value,
          "Radius (EU)":Radius.current?.value,
          Stellar_luminosity:Stellar_luminosity.current?.value,
          Stellar_mass:Stellar_mass.current?.value,
          Stellar_radius:Stellar_radius.current?.value,
        }
        const ret = await http.post('api/predict',{
          features : features

        })
        if(ret.data.state == 'success') {
          PredictionStore.addItem({Planet_name:Planet_name.current?.value,habitable:ret.data.habitable, esi:ret.data.esi,features:features,Orbit_period:Orbit_period.current?.value,
            Semi_major_axis:Semi_major_axis.current?.value,
            Mass:Mass.current?.value,
            Radius:Radius.current?.value,
            Stellar_luminosity:Stellar_luminosity.current?.value,
            Stellar_mass:Stellar_mass.current?.value,
            Stellar_radius:Stellar_radius.current?.value,})
        }
        else message.error('unknown error.')
      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) message.error(e.response.data.error_message)
        else message.error(e.message)
      }
    }
    Predict()
    // PredictionStore.addItem({name:Planet_name.current?.value,habitable:false,esi:0.5})

  }
  return (
    <div className="InnerPredictionContent"> 
      <div className = 'PredictInputContent'>
        <div className="input-items">
          <span className="input-tips">
              {t('Planet name')}
          </span>
          <br></br>
          <input type="text" className="predictinputs" placeholder= {t("Enter")+ t('Planet name')} ref = {Planet_name} />
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            {t('Orbital Period[days]')}
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t('Orbital Period[days]')} ref = {Orbit_period} />
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            {t('Orbit Semi-Major Axis')}
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Orbit Semi-Major Axis")} ref = {Semi_major_axis}/>
          
        </div>
        
        <div className="input-items">
          <span className="input-tips">
            {t('Planet Mass')}
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Planet Mass")} ref = {Mass} />
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            {t('Planet Radius')}
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Planet Radius")} ref={Radius}/>
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            {t('Stellar Luminosity')}
            
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Stellar Luminosity")} ref = {Stellar_luminosity}/>
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            {t('Stellar Mass')}
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Stellar Mass")} ref = {Stellar_mass}/>
        </div>
        <div className="input-items">
          <span className="input-tips">
          {t('Stellar Radius')}
            
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Stellar Radius")} ref = {Stellar_radius}/>
        </div>
      </div>
      <div className="MiddleButtonContent">
        <motion.button
          className="box" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handlePredictClicked}
          type = 'submit'
        >
          {t('Predict')} →
        </motion.button>
      </div>

      <div className='ReorderContent'>
        <Reorder.Group  axis="y" onReorder={PredictionStore.setItems} values={PredictionStore.items}>
        {PredictionStore.items.map((item) => (
          <Item key={item.name} item={item} />
        ))}
        </Reorder.Group>

      </div>
      
    </div>
  )
}

export default observer(InnerPrediction)