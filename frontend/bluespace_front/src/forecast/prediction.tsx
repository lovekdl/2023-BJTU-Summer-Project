import React from 'react';
import "./forecast.style.css"
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';


const { Header, Content, Sider } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`
}));

import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined
} from "@ant-design/icons";

export default function Prediction() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div>
      <Layout>
        {/* <Sider width={300} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            className = 'SliderMenu'
            
            items={items2}  
          />
        </Sider> */}
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