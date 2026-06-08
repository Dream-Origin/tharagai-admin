import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Statistic } from "antd";
import { ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined, RocketOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { fetchOrders } from "../api/ordersApi";
import './Dashboard.css';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusCount = (status) => orders.filter(o => o.status === status).length;

  if (loading) return <div className="dashboard-loading"><Spin size="large"/></div>;

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: <ShoppingCartOutlined />, color: 'linear-gradient(90deg,#667eea,#764ba2)' },
    { title: 'Pending', value: statusCount('Pending'), icon: <ClockCircleOutlined />, color: 'linear-gradient(90deg,#f6d365,#fda085)' },
    { title: 'Confirmed', value: statusCount('Confirmed'), icon: <CheckCircleOutlined />, color: 'linear-gradient(90deg,#89f7fe,#66a6ff)' },
    { title: 'Shipped', value: statusCount('Shipped'), icon: <RocketOutlined />, color: 'linear-gradient(90deg,#fddb92,#d1fdff)' },
    { title: 'Delivered', value: statusCount('Delivered'), icon: <CheckCircleOutlined />, color: 'linear-gradient(90deg,#a8ff78,#78ffd6)' },
    { title: 'Cancelled', value: statusCount('Cancelled'), icon: <CloseCircleOutlined />, color: 'linear-gradient(90deg,#f5576c,#f093fb)' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-title">Welcome back</h1>
          <p className="dashboard-subtitle">Overview of your store activity.</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="stats-row">
        {stats.map((s) => (
          <Col key={s.title} xs={24} sm={12} md={8} lg={8} xl={4}>
            <Card hoverable className="stat-card" bodyStyle={{ padding: 16 }}>
              <div className="stat-left" style={{ background: s.color }}>
                <div className="stat-icon">{s.icon}</div>
              </div>
              <div className="stat-right">
                <Statistic title={s.title} value={s.value} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
