import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const HeaderBar = () => (
  <Header style={{ background: '#fff', padding: 0 }}>
    <h2 style={{ marginLeft: 16 }}>E-commerce Admin Portal</h2>
  </Header>
);

export default HeaderBar;
