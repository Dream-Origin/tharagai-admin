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
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            height: '100vh', // Full height
            position: 'fixed', // Fix it in place
            top: 0, // Align to top
            left: 0, // Align to the left side of the viewport
            overflowY: 'auto', // Make the content scrollable
            width: collapsed ? 80 : 200, // Change width based on collapsed state
            zIndex: 100, // Ensure sidebar stays on top
          }}
        >
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

        <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
          {/* Adding marginLeft to offset the fixed sidebar */}
          <Header
            style={{
              padding: '0 16px',
              background: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky', // Make the header sticky
              top: 0, // Stick to top
              zIndex: 1000, // Ensure header stays on top of content
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
