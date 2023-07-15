import { Table } from "antd"
import {useStore} from "../store/index"
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import {http} from '../utils'
import {message} from 'antd'
import { observer } from 'mobx-react-lite';
 function ProfilePlanets() {
  const navigate = useNavigate();
  const {ProfileStore,StarMapStore} = useStore()
  const {t,i18n} = useTranslation()
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
  async function handleDeleteClicked(id :any) {
    try {
      const ret = await http.post('api/deletePlanet',{
        id:id
      })
      if(ret.data.state == 'success') {
        message.success('Success')
        
      }
      else message.error('unknown error.')
    }
    catch(e:any) {
      console.log('catch : ',e)
      if(e.response) message.error(e.response.data.error_message)
      else message.error(e.message)
    }
    ProfileStore.getSource()
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
    },{
      title: t('delete'),
      dataIndex: 'delete',
      key: 'delete',
      render: (text:any, record:any) => <motion.button
        className="box5" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={() => handleDeleteClicked(record.id)}
      >
        {t('delete')} 
      </motion.button>,
    },
  ] as any;
  return (
    <div>
      
      <p style={{marginLeft:"5vw"}}>{t('My Planets')}</p>
      <div>
        <Table  className="TableDiv" columns={Columns}  dataSource={ProfileStore.DataSource}></Table>
      </div>
    </div>
  )
}

export default observer(ProfilePlanets)