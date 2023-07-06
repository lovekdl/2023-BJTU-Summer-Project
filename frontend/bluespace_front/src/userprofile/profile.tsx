import React from 'react';
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./userprofile.style.css"

const { Content, Sider } = Layout;


import {
  UserOutlined
} from "@ant-design/icons";

export default function Profile() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  

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
          defaultSelectedKeys={['4']}
          className='SliderMenu'
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
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
            aaa
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}