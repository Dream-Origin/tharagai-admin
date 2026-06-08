import React from "react";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const menu = (
    <Menu>
      <Menu.Item>Profile</Menu.Item>
      <Menu.Item>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        padding: "0 20px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        background: "#fff",
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
      }}
    >
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar size="large" icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
};

export default Navbar;
