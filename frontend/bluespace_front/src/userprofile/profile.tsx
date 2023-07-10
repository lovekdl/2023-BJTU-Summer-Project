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



const { Content, Sider } = Layout;
function Profile() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nowKey, setNowKey] = useState(1);
  const [content, setContent] = useState(<div></div>);

  const {ProfileStore} = useStore();
  function getLabel(x:number) {
    if(x === 1) {
      return "profile"
    }
    if(x === 2) {
      return "friends"
    }
    if(x === 3) {
      return "planets"
    }
  }
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
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined].map(
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