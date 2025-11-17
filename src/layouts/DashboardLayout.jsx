import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CustomNotification } from '../components/CustomNotification.jsx';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = () => setCollapsed(!collapsed);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/products', icon: <ShoppingCartOutlined />, label: 'Products' },
    { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <>
      <CustomNotification />
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" style={{ color: 'white', margin: '16px', textAlign: 'center' }}>
            {collapsed ? 'AD' : 'Admin Portal'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: '0 16px',
              background: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button type="text" onClick={toggle}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Button>
          </Header>
          <Content style={{ margin: '16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default DashboardLayout;
