import * as React from "react";
import { useMotionValue, Reorder } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import "./forecast.style.css"
import { motion } from "framer-motion";
import '../index.tsx';
import {useTranslation} from 'react-i18next'
interface Props {
  item: any;
}

export const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const {t,i18n} = useTranslation()
  return (
    <div className = 'ReorderItem'>
      <Reorder.Item value={item} id={item.name} style={{ boxShadow, y }} >
        <div>{item.name}| ESI:{item.esi} | {item.habitable===true?"Habitable":"NOT Habitable"}</div>
        <motion.button
          className="box3" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          
          type = 'submit'
        >
          {t("Save")}
        </motion.button>
      </Reorder.Item>
      
    </div>
  );
};
