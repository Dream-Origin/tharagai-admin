import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = () => {
    if (isMobile) {
      setDrawerVisible((v) => !v);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // track viewport width to switch to mobile behaviour
  React.useEffect(() => {
    const mq = () => setIsMobile(window.innerWidth < 768);
    mq();
    window.addEventListener('resize', mq);
    return () => window.removeEventListener('resize', mq);
  }, []);

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
      <Layout style={{ minHeight: '100vh' }}>
        {!isMobile ? (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              overflowY: 'auto',
              width: collapsed ? 80 : 200,
              zIndex: 100,
            }}
          >
            <div className="logo" style={{ color: 'white', margin: '16px', textAlign: 'center' }}>
              {collapsed ? 'AD' : 'Admin Portal'}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={(e) => {
                handleMenuClick(e);
                // on mobile we'd close drawer; desktop unaffected
                if (isMobile) setDrawerVisible(false);
              }}
              items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
              }))}
            />
          </Sider>
        ) : (
          <Drawer
            title={<div style={{ color: '#fff', fontWeight: 600 }}>Admin Portal</div>}
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={Math.min(360, Math.round(window.innerWidth * 0.85))}
            bodyStyle={{ padding: 0, background: '#001529', height: '100%' }}
            headerStyle={{ background: '#001529', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            maskClosable
            maskStyle={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            zIndex={1200}
            closeIcon={<span style={{ color: '#fff' }}>✕</span>}
          >
            <div style={{ paddingTop: 8 }}>
              <div style={{ color: '#fff', padding: '12px 16px', fontSize: 18, fontWeight: 700 }}>
                Admin
              </div>
              <Menu
                theme="dark"
                mode="inline"
                style={{ background: 'transparent', borderRight: 'none' }}
                selectedKeys={[location.pathname]}
                onClick={(e) => {
                  handleMenuClick(e);
                  setDrawerVisible(false);
                }}
                items={menuItems.map((item) => ({
                  key: item.key,
                  icon: item.icon,
                  label: item.label,
                }))}
              />
            </div>
          </Drawer>
        )}

        <Layout
          className="site-layout"
          style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 200 }}
        >
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
              {isMobile ? <MenuUnfoldOutlined /> : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
