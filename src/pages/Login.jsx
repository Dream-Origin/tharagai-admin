import React from 'react';
import { Card, Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, loading } = useAuth();

  const onFinish = (values) => {
    login(values.email, values.password);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #f6f8ff 0%, #eef2ff 100%)',
      padding: 16
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 14,
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
          border: '1px solid #e5e7eb'
        }}
        styles={{ body: { padding: 28 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
            Admin Login
          </h2>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>
            Sign in to manage products and orders
          </p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ height: 44, borderRadius: 10, fontWeight: 600 }}
            >
              Login
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            {/* Don&apos;t have an account? <Link to="/register">Register</Link> */}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
