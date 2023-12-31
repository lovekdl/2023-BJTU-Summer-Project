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
import {Popover} from'antd'
import {QuestionCircleTwoTone} from "@ant-design/icons"
import PredictionChart from './prediction.charts.tsx'
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
      if(element.Planet_name == Planet_name.current?.value) {
        message.error('Repeated name')
        return;
      }
    }


    //预测
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
        console.log(ret);
        if(ret.data.state == 'success') {
          console.log(ret.data)
          PredictionStore.addItem({Planet_name:Planet_name.current?.value,habitable:(ret.data.predict_hb), esi:ret.data.esi,features:features,   Orbit_period:Orbit_period.current?.value,
            Semi_major_axis:Semi_major_axis.current?.value,
            Mass:Mass.current?.value,
            Radius:Radius.current?.value,
            Stellar_luminosity:Stellar_luminosity.current?.value,
            Stellar_mass:Stellar_mass.current?.value,
            Stellar_radius:Stellar_radius.current?.value,})
        }
        else message.error(ret.data.error_message)
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
      <div>
        <div className = 'InputsAlign4' >
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
                {t('Planet name')}
            </span>
            <Popover content = {t('Planet name message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="text" className="predictinputs" placeholder= {t("Enter")+ t('Planet name')} ref = {Planet_name} />
            
          </div>
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
              {t('Orbital Period[days]')}
            </span>
            <Popover content = {t('Orbital Period[days] message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t('Orbital Period[days]')} ref = {Orbit_period} />
            
          </div>
          
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
              {t('Orbit Semi-Major Axis')}
            </span>
            <Popover content = {t('Orbit Semi-Major Axis message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Orbit Semi-Major Axis")} ref = {Semi_major_axis}/>
            
          </div>
        
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
              {t('Planet Mass')}
            </span>
            <Popover content = {t('Planet Mass message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Planet Mass")} ref = {Mass} />
          </div>
        </div>
        <div className = 'InputsAlign4' >
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
              {t('Planet Radius')}
            </span>
            <Popover content = {t('Planet Radius message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Planet Radius")} ref={Radius}/>
            
          </div>
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
              {t('Stellar Luminosity')}
            </span>
            <Popover content = {t('Stellar Luminosity message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Stellar Luminosity")} ref = {Stellar_luminosity}/>
            
          </div>
          <div className="input-items" style = {{margin:'5px'}}>
            <span className="input-tips">
              {t('Stellar Mass')}
            </span>
            <Popover content = {t('Stellar Mass message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Stellar Mass")} ref = {Stellar_mass}/>
          </div>
          <div className="input-items" style = {{margin:'5px'}}>
              <span className="input-tips">
                
              {t('Stellar Radius')}
              </span>
            <Popover content = {t('Stellar Radius message')}>
              <QuestionCircleTwoTone />
            </Popover>
            <br></br>
            <input type="number" className="predictinputs" placeholder={t("Enter")+ t("Stellar Radius")} ref = {Stellar_radius}/>
          
          </div>
          </div >
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
          {t('Predict')} 
        </motion.button>
      </div>
      <div className="ResultContent">
        <div className='ReorderContent'>
          <div>
              <div className="NormalFont">{t('Predict result')}
              <Popover content = {t('Predict result message')}>
              <QuestionCircleTwoTone />
              </Popover>  
            </div>
          </div>
          <Reorder.Group  axis="y" onReorder={PredictionStore.setItems} values={PredictionStore.items} style={{
              height: '58vh',
              width: 580,
              border: "3px solid rgb(128, 106, 196)",
              borderRadius : "10px",
              overflowY: "auto",
              padding: "20px"
            }}
            layoutScroll >
            {PredictionStore.items.map((item) => (
              <Item key={item.Planet_name} item={item} />
            ))}
          </Reorder.Group>

        </div>
        <div className='ReorderContent2'>
          <div>
              <div className="NormalFont">{t('Picture')}
              <Popover content = {t('Picture message')}>
              <QuestionCircleTwoTone />
              </Popover>  
            </div>
          </div>
          <div style={{
              height: '58vh',
              width: 580,
              border: "3px solid rgb(128, 106, 196)",
              borderRadius : "10px",
              overflowY: "auto",
              padding: "20px"
            }}
              
            >
              <div>
                <PredictionChart></PredictionChart>
              </div>
          </div>
          

        </div>
      </div>
      
    </div>
  )
}

export default observer(InnerPrediction)