import { useState } from 'react';
import { http } from '../utils/http.tsx';
import { getTokenFromLocalStorage } from '../utils/token.tsx';
import {Table} from 'antd'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite';
import '../index.tsx';
import { motion } from "framer-motion";
import {useTranslation} from 'react-i18next'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import AnalysisPage from "./analysispage";
import { useNavigate } from 'react-router-dom';

function Statistics() {
  const {StatisticsStore} = useStore()
  const {StarMapStore} = useStore();
  const {t,i18n} = useTranslation()
  const navigate = useNavigate();
  function handleGoClicked(record:any) { 
    
    StarMapStore.setGoPlanet(true);
    console.log(record.habitable)
    StarMapStore.setPlanetFeatures({
      Planet_name:record.Planet_name,
      habitable:record.habitable,
      esi:record.esi,
      Orbit_period:record.Orbit_period,
      Semi_major_axis:record.Semi_major_axis,
      Mass:record.Mass,
      Radius:record.Radius,
      Stellar_luminosity:record.Stellar_luminosity,
      Stellar_mass:record.Stellar_mass,
      Stellar_radius:record.Stellar_radius,
    })
    navigate('/',{replace:false})
  }
  const Columns = [
    {
      title: t('Planet name'),
      dataIndex: 'Planet_name',
      key: 'Planet_name',
    },
    {
      title: t('Orbital Period[days]'),
      dataIndex: 'Orbit_period',
      key: 'Orbit_period',
    },
    {
      title: t('Orbit Semi-Major Axis'),
      dataIndex: 'Semi_major_axis',
      key: 'Semi_major_axis',
    },
    {
      title: t('Planet Mass'),
      dataIndex: 'Mass',
      key: 'Mass',
    },
    {
      title: t('Planet Radius'),
      dataIndex: 'Radius',
      key: 'Radius',
    },
    {
      title: t('Stellar Luminosity'),
      dataIndex: 'Stellar_luminosity',
      key: 'Stellar_luminosity',
    },
    {
      title: t('Stellar Mass'),
      dataIndex: 'Stellar_mass',
      key: 'Stellar_mass',
    },
    {
      title: t('Stellar Radius'),
      dataIndex: 'Stellar_radius',
      key: 'Stellar_radius',
    },
    {
      title: t('ESI'),
      dataIndex: 'esi',
      key: 'esi',
    },
    {
      title: t('Habitability'),
      dataIndex: 'habitable',
      key: 'habitable',
    },{
      title: t('go'),
      dataIndex: 'subscribe',
      key: 'subscribe',
      render: (text:any, record:any) => <motion.button
        className="box5" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={() => handleGoClicked(record)}
      >
        {t('go')} 
      </motion.button>,
    },
    
    
  ];

  return (
    <div>
      <p style={{marginLeft:"5vw"}}>{t('All Planets')}</p>
      <Table className="TableDiv" columns={Columns} pagination={{ pageSize: 5 }}  dataSource={StatisticsStore.DataSource}></Table>
      <div>
        <AnalysisPage></AnalysisPage>
      </div>
    </div>
  )
} 

export default observer(Statistics)