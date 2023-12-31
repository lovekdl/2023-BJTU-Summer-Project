import React,{useRef,useState,useEffect} from 'react';

import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./forecast.style.css"
import { observer } from 'mobx-react-lite'
import { useStore } from '../store';

import Statistics from './statistics';
import InnerPrediction from './innerprediction';
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import ProfilePlanets from '../userprofile/profileplanets.tsx'

const { Content, Sider } = Layout;


function Prediction() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nowKey, setNowKey] = useState(1);
  const [content, setContent] = useState(<div></div>);
  const {t,i18n} = useTranslation()
  const {ProfileStore} = useStore();
  function getLabel(x:number) {
    console.log('x' + x)
    if(x === 1) {
      return t('Statistics')
    }
    
    if(x === 2) {
      return t("Prediction")
    }
    if(x === 3) {
      return t("My planets")
    }
  }
  // useEffect(() => {
  //   const handleWheel = (e:any) => {
  //     e.preventDefault();
  //   };

  //   // 在组件挂载时添加滚轮事件监听器
  //   window.addEventListener('wheel', handleWheel, { passive: false });

  //   // 在组件卸载时移除滚轮事件监听器
  //   return () => {
  //     window.removeEventListener('wheel', handleWheel);
  //   };
  // }, []);
  useEffect(()=>{
    if(nowKey == 1) {//Statistics
      setContent(
        <Statistics/>
      )
    } 
    
    if(nowKey == 2) {//Prediction
      setContent(
      <div>
        <InnerPrediction></InnerPrediction>
      </div>
      )
    } 
    if(nowKey == 3) {
      setContent(<div>
        <ProfilePlanets></ProfilePlanets>
      </div>) 
    }
  },[nowKey])
  
  function handleLeftMenuClicked  ({key} : any) {
    console.log(key)
    setNowKey(key)
  }
  return (
    <div className='divTop'>
      
      <Layout>
        <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          className='SliderMenu'
          items={[UploadOutlined, VideoCameraOutlined, UploadOutlined].map(
            (icon, index) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: <span >{`${getLabel(index+1)}`}</span>,
            }),
          )}
          onSelect={handleLeftMenuClicked}
        />
      </Sider>

      
      <Layout style={{ padding: "0 24px 0px" }}>
          
          <Content className='ProfileContent'>
            
            {content}

          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default observer(Prediction);