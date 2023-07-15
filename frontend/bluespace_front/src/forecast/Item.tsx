import * as React from "react";
import { useMotionValue, Reorder } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import "./forecast.style.css"
import { motion } from "framer-motion";
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import { http } from "../utils/http.tsx";
import {message, Popover} from 'antd'
import { useNavigate } from "react-router";
import {useStore} from '../store/index'
interface Props {
  item: any;
}

export const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const navigate = useNavigate();
  const {t,i18n} = useTranslation()
  const {StarMapStore,PredictionStore,ProfileStore} = useStore();
  const handleSaveClicked = () => {
    let features = {
      
      Orbit_period:item.Orbit_period,
      Semi_major_axis:item.Semi_major_axis,
      Mass:item.Mass,
      Radius:item.Radius,
      Stellar_luminosity:item.Stellar_luminosity,
      Stellar_mass:item.Stellar_mass,
      Stellar_radius:item.Stellar_radius,
    }
    async function Save() {
      try {
        
        const ret = await http.post('api/save',{
          features : features,
          Planet_name: item.Planet_name,
          esi:'0.9',
          habitable:item.habitable
        })
        
        if(ret.data.state == 'success') {
          message.success(t('Success'))
          ProfileStore.getSource()
        }
        else message.error('unknown error.')
      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) message.error(e.response.data.error_message)
        else message.error(e.message)
      }
    }
    Save()

  }
  const handleNavigateClicked = () => {
    StarMapStore.setGoPlanet(true);
    console.log(item.habitable)
    StarMapStore.setPlanetFeatures({
      Planet_name:item.Planet_name,
      habitable:item.habitable,
      esi:item.esi,
      Orbit_period:item.Orbit_period,
      Semi_major_axis:item.Semi_major_axis,
      Mass:item.Mass,
      Radius:item.Radius,
      Stellar_luminosity:item.Stellar_luminosity,
      Stellar_mass:item.Stellar_mass,
      Stellar_radius:item.Stellar_radius,
    })
    navigate('/',{replace:false})
  }

  const getContent = (item:any) => {
    return (
      <div>
        {t('Habitability')}:{t(item.habitable)}
        <br></br>
        {t('ESI')}:{item.esi}
        <br></br>

      </div>
    )
  }
  const handleItemClicked = (item:any) => {
    PredictionStore.setShowEsi(item.esi)
    PredictionStore.setShowData([item.Semi_major_axis,item.Mass,item.Radius,item.Stellar_luminosity,item.Stellar_radius,item.Stellar_mass])
    console.log(PredictionStore.showData)
  }
  return (
    <div className = 'ReorderItem'>
      
      <Reorder.Item value={item} id={item.Planet_name} style={{ boxShadow, y }} onClick={() => handleItemClicked(item)} >
        <Popover content={getContent(item)}>
          <div className="ItemDisplayStyle">
            {item.Planet_name}
            
            <div className="buttons">
              
              <motion.button
                className="box4" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={handleNavigateClicked}
              >
                {t("See in starmap")}
              </motion.button>
              <motion.button
                className="box4" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                
                onClick={handleSaveClicked}
              >
                {t("Save in my planets")}
              </motion.button>
              </div>
          </div>
        </Popover>
      </Reorder.Item>
      
    </div>
  );
};
