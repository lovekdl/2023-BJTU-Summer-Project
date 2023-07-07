import React,{useRef,useState,useEffect} from 'react';
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./forecast.style.css"
import {motion} from "framer-motion";
import { observer } from 'mobx-react-lite'
import {Avatar} from 'antd'
import { useStore } from '../store';
import Gauge from "../dataanalysis/Gauge";
import BarGraph from "../dataanalysis/BarGraph";
import PieChart from "../dataanalysis/PieChart";
import LineChart from "../dataanalysis/LineChart";
import {
  UserOutlined
} from "@ant-design/icons";
import {quat2} from "gl-matrix";
import translate = module



const { Content, Sider } = Layout;
function Prediction() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nowKey, setNowKey] = useState(1);
  const [content, setContent] = useState(<div></div>);

  const {ProfileStore} = useStore();
  function getLabel(x:number) {
    if(x === 1) {
      return "Statistics"
    }
    if(x === 2) {
      return "Analysis"
    }
    if(x === 3) {
      return "Prediction"
    }
  }
  useEffect(()=>{
    if(nowKey == 1) {//Statistics
      setContent(
      <div>
      </div>
      )
    } 
    if(nowKey == 2) {//Analysis
      setContent(
      <Layout >
        <div className='ContentLayout'>
          <BarGraph></BarGraph>
          <div style={{marginTop: 150}}>
            <PieChart></PieChart>
          </div>
        </div>
        <div className='ContentLayout'>
          <div  style={{marginLeft: 100}}>
            <LineChart></LineChart>
          </div>
          <div>
            <Gauge></Gauge>
          </div>
        </div>
      </Layout>
      )
    } 
    if(nowKey == 3) {//Prediction
      setContent(
      <div>
        
      </div>
      )
    } 
  },[nowKey])
  const handleUploadClicked = ()=> {
    console.log('hahaha')
    if(fileInputRef.current)
    fileInputRef.current.click();
  }
  const handleFileChange = (event:any) => {
    const imgfile = event.target.files[0];
    console.log(imgfile);
    var reader = new FileReader();
    reader.onload=function(){
      var fileurl = reader.result
      ProfileStore.setAvatar(fileurl)
      console.log('fileurl is ' + fileurl);
    }
    reader.readAsDataURL(imgfile)

  };
  
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
          <Content >

            {content}

          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default observer(Prediction);