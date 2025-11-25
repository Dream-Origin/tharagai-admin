import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Statistic } from "antd";
import { fetchOrders } from "../api/ordersApi";

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

  if (loading) return <Spin />;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Total Orders" value={orders.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="Pending" value={statusCount("Pending")} /></Card></Col>
        <Col span={6}><Card><Statistic title="Confirmed" value={statusCount("Confirmed")} /></Card></Col>
        <Col span={6}><Card><Statistic title="Shipped" value={statusCount("Shipped")} /></Card></Col>
        <Col span={6}><Card><Statistic title="Delivered" value={statusCount("Delivered")} /></Card></Col>
        <Col span={6}><Card><Statistic title="Cancelled" value={statusCount("Cancelled")} /></Card></Col>
      </Row>
    </div>
  );
}
