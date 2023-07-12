import { useState } from 'react';
import { http } from '../utils/http.tsx';
import { getTokenFromLocalStorage } from '../utils/token.tsx';
import {Table} from 'antd'
import { useStore } from '../store/index'
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';

const HeartButton = ({ record }:any) => {
  const [isLiked, setIsLiked] = useState('collect');
  const handleClick = () => {
    async function postSub() {
      const ret = await http.post('api/collect', {
        id : record.id,
      })
      return ret
    }
    const ret = postSub()
    ret.then(res => {
      console.log(res)
      if(res.data.state === 'success'){
        setIsLiked(isLiked === 'false'?'true':'false');
      }
    }).catch(e => {
      console.log(e)
    })
  };
  

  return (
    <IconButton onClick={handleClick} color={isLiked==='true' ? 'error' : 'default'}>
      {isLiked==='true' ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

export default function Statistics() {
  const {StatisticsStore} = useStore()
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
    {
      title: '关注',
      dataIndex: 'subscribe',
      key: 'subscribe',
      render: (text:any, record:any) => <HeartButton record={record} />,
    },
    
  ];

  return (
    <div className='ContentLayout'>
      <Table className="TableDiv" columns={Columns}  dataSource={StatisticsStore.DataSource}></Table>
    </div>
  )
} 