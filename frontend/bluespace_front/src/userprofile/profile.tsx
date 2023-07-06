import React,{useRef} from 'react';
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./userprofile.style.css"
import {motion} from "framer-motion";
import { observer } from 'mobx-react-lite'
import {Avatar} from 'antd'
import { useStore } from '../store';
import {
  UserOutlined
} from "@ant-design/icons";



const { Content, Sider } = Layout;
function Profile() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      ProfileStore.setAvatar(fileurl) // 这个 useState 把获取的base64 给到img 的src 上
      console.log('fileurl is ' + fileurl);
    }
    reader.readAsDataURL(imgfile)

  };
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
              label: `${getLabel(index+1)}`,
            }),
          )}
        />
      </Sider>

      
        <Layout style={{ padding: "0 24px 0px" }}>
          
          <Content className='ProfileContent'>
            <div className = 'HeadPicture'>
              {ProfileStore.avatar===''? <Avatar size={128} icon={<UserOutlined />} /> : <Avatar size={128} src={<img src={ProfileStore.avatar}  alt="avatar" />} />}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <motion.button
                className="ProfileBox" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={handleUploadClicked}
              >
                Upload
              </motion.button>


              
            </div>


          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default observer(Profile);