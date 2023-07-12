import React,{useRef,useState,useEffect} from 'react';
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./userprofile.style.css"
import {motion} from "framer-motion";
import { observer } from 'mobx-react-lite'
import {Avatar} from 'antd'
import { useStore } from '../store';
import ProfilePlanets from './profileplanets';
import {
  UserOutlined
} from "@ant-design/icons";
import Innerprofile from './innerprofile';
import '../index.tsx';
import {useTranslation} from 'react-i18next'


const { Content, Sider } = Layout;
function Profile() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nowKey, setNowKey] = useState(1);
  const [content, setContent] = useState(<div></div>);
  const {t,i18n} = useTranslation()
  const {ProfileStore} = useStore();
  function getLabel(x:number) {
    if(x === 1) {
      return t("profile")
    }
    if(x === 2) {
      return t("planets")
    }
    
  }
  useEffect(() => {
    const handleWheel = (e:any) => {
      e.preventDefault();
    };

    // 在组件挂载时添加滚轮事件监听器
    window.addEventListener('wheel', handleWheel, { passive: false });

    // 在组件卸载时移除滚轮事件监听器
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  useEffect(()=>{
    if(nowKey == 1) {
      setContent(
        <Innerprofile></Innerprofile>
      )
    } 
    else if(nowKey == 2) {
      setContent(
        <ProfilePlanets></ProfilePlanets>
      )
    }
    else {
      setContent(<div></div>);
    } 
  },[nowKey])
  
  
  function handleLeftMenuClicked  ({key} : any) {
    console.log(key)
    setNowKey(key)
  }
  return (
    <div>
      
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
        className='Slider'
      >
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          className='SliderMenu'
          items={[UserOutlined, UploadOutlined].map(
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

export default observer(Profile);