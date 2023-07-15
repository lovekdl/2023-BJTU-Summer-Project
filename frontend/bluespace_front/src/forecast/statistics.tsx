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
import {Popover} from'antd'
import {QuestionCircleTwoTone} from "@ant-design/icons"
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
      title:<div style={{width:"7vw"}}>{t('Planet name')}
            </div>,
      dataIndex: 'Planet_name',
      key: 'Planet_name',
    },
    {
      title:<div>{t('Orbital Period[days]')}
        <Popover content = {t('Orbital Period[days] message')}>
        <QuestionCircleTwoTone />
        </Popover>
      </div> ,
      dataIndex: 'Orbit_period',
      key: 'Orbit_period',
    },
    {
      title:<div>{t('Orbit Semi-Major Axis')}
      <Popover content = {t('Orbit Semi-Major Axis message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div> ,
      dataIndex: 'Semi_major_axis',
      key: 'Semi_major_axis',
    },
    {
      title: <div>{t('Planet Mass')}
      <Popover content = {t('Planet Mass message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div>,
      dataIndex: 'Mass',
      key: 'Mass',
    },
    {
      title: <div>{t('Planet Radius')}
      <Popover content = {t('Planet Radius message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div>,
      dataIndex: 'Radius',
      key: 'Radius',
    },
    {
      title: <div>{t('Stellar Luminosity')}
      <Popover content = {t('Stellar Luminosity message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div>,
      dataIndex: 'Stellar_luminosity',
      key: 'Stellar_luminosity',
    },
    {
      title:<div>{t('Stellar Mass')}
      <Popover content = {t('Stellar Mass message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div>,
      dataIndex: 'Stellar_mass',
      key: 'Stellar_mass',
    },
    {
      title: <div>{t('Stellar Radius')}
      <Popover content = {t('Stellar Radius message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div>,
      dataIndex: 'Stellar_radius',
      key: 'Stellar_radius',
    },
    {
      title: <div>{t('ESI')}
      <Popover content = {t('ESI message')}>
      <QuestionCircleTwoTone />
      </Popover>
    </div>,
      dataIndex: 'esi',
      key: 'esi',
      sorter:(a:any,b:any) => a.esi-b.esi,
    },
    {
      title: t('Habitability'),
      dataIndex: 'habitable',
      key: 'habitable',
      filters: [
        {
          text: t('Habitable'),
          value: t('Habitable'),
        },
        {
          text: t('NOT Habitable'),
          value: t('NOT Habitable'),
        },
      ],
      onFilter: (value: string, record:any) => record.habitable.indexOf(value) === 0,
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
    
    
  ] as any;

  return (
    <div>
      <p style={{marginLeft:"5vw"}}>{t('All Planets')} <a href="https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS"  target="opentype">{t('DataSource: NASA EXOPLANET ARCHIVE')}</a></p>
      <Table className="TableDiv" columns={Columns} pagination={{ pageSize: 4 }}  dataSource={StatisticsStore.DataSource}></Table>
      <div>
        <AnalysisPage></AnalysisPage>
      </div>
    </div>
  )
} 

export default observer(Statistics)