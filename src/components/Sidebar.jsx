import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ setPage }) => (
  <Sider breakpoint="lg" collapsedWidth="0">
    <div className="logo" style={{ color: 'white', padding: 16, fontSize: 20 }}>Admin</div>
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['dashboard']}
      onClick={({ key }) => setPage(key)}
      items={[
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
        { key: 'users', icon: <UserOutlined />, label: 'Users' },
      ]}
    />
  </Sider>
);

export default Sidebar;
