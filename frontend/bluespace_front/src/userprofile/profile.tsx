import React from 'react';
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';


const { Content, Sider } = Layout;


import {
  UserOutlined
} from "@ant-design/icons";

export default function Profile() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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
              label: `nav ${index + 1}`,
            }),
          )}
        />
      </Sider>

      
        <Layout style={{ padding: "0 24px 0px" }}>
            
          <Content
            style={{
              padding: 24,
              margin: 5,
              minHeight: 100,
              background: colorBgContainer
            }}
          >
            
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}