import {Table} from 'antd'
import { useStore } from '../store/index'
import '../index.tsx';
import {useTranslation} from 'react-i18next'


export default function Statistics() {
  const {PredictionStore} = useStore()
  const {t,i18n} = useTranslation()
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
      title: t('Habitable'),
      dataIndex: 'habitable',
      key: 'habitable',
    },
  ];

  return (
    <div className='ContentLayout'>
      <Table className="TableDiv" columns={Columns}  dataSource={PredictionStore.DataSource}></Table>
    </div>
  )
} 