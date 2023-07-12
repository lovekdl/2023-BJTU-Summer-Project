import * as React from "react";
import { useMotionValue, Reorder } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import "./forecast.style.css"
import { motion } from "framer-motion";
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import { http } from "../utils/http.tsx";
import {message} from 'antd'
interface Props {
  item: any;
}

export const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const {t,i18n} = useTranslation()
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
        const ret = await http.post('api/predict',{
          features : features,
          Planet_name: item.Planet_name,
          esi:item.esi,
          habitable:item.habitable
        })
        if(ret.data.state == 'success') {
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
  return (
    <div className = 'ReorderItem'>
      <Reorder.Item value={item} id={item.name} style={{ boxShadow, y }} >
        <div>{item.name}| ESI:{item.esi} | {item.habitable===true?"Habitable":"NOT Habitable"}</div>
        <motion.button
          className="box3" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          
          onClick={handleSaveClicked}
        >
          {t("Save")}
        </motion.button>
      </Reorder.Item>
      
    </div>
  );
};
