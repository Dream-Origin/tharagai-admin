import React, { useEffect, useState } from "react";
import { Table, Tag, Select, Modal, Button, Spin, message, Divider, Typography, Row, Col } from "antd";
import { fetchOrders, updateOrderStatus } from "../api/ordersApi";
import './Orders.css'; // custom styles

const { Option } = Select;
const { Title, Text } = Typography;

const statusOptions = [
  "Pending", "Confirmed", "Processing", "Packed",
  "Shipped", "In Transit", "Out for Delivery",
  "Delivered", "Cancelled", "Returned", "Refund Completed",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      message.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      message.success("Order status updated");
      loadOrders();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "User", render: (_, record) => `${record.user.firstName} ${record.user.lastName}` },
    { title: "Email", dataIndex: ["user", "email"] },
    { title: "Mobile", dataIndex: ["user", "phone"] },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record._id, val)}
          style={{ width: 150 }}
        >
          {statusOptions.map((s) => <Option key={s} value={s}>{s}</Option>)}
        </Select>
      ),
    },
    { title: "Total Amount", dataIndex: "totalAmount", render: (amt) => `₹${amt}` },
    {
      title: "Payment Status",
      dataIndex: ["payment", "status"],
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => { setSelectedOrder(record); setModalVisible(true); }}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>All Orders</h2>
      {loading ? <Spin size="large" /> : <Table rowKey="_id" columns={columns} dataSource={orders} />}

      {/* Modern Order Details Modal */}
      <Modal
        visible={modalVisible}
        title={<Title level={4} style={{ margin: 0 }}>Order #{selectedOrder?.orderId}</Title>}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
        bodyStyle={{ padding: '20px 40px', background: '#f9f9f9', borderRadius: 8 }}
        centered
      >
        {selectedOrder && (
          <div className="order-modal-content">
            <Row gutter={24}>
              <Col span={12}>
                <Title level={5}>Customer Details</Title>
                <Text strong>Name:</Text> {selectedOrder.user.firstName} {selectedOrder.user.lastName}<br/>
                <Text strong>Email:</Text> {selectedOrder.user.email}<br/>
                <Text strong>Phone:</Text> {selectedOrder.user.phone}<br/>
              </Col>
              <Col span={12}>
                <Title level={5}>Shipping Address</Title>
                <Text>{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}</Text><br/>
                <Text strong>Country:</Text> {selectedOrder.shippingAddress.country}<br/>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Order Items</Title>
            {selectedOrder.items.map((item) => (
              <div key={item.productId} className="order-item-card">
                <img src={item.images[0]} alt={item.title} className="order-item-img"/>
                <div className="order-item-details">
                  <Text strong>{item.title}</Text><br/>
                  <Text>Size: {item.size || "N/A"} | Qty: {item.quantity}</Text><br/>
                  <Text>Price: ₹{item.price}</Text>
                </div>
              </div>
            ))}

            <Divider />

            <Row justify="space-between">
              <Col><Title level={5}>Total Amount:</Title></Col>
              <Col><Title level={5} style={{ color: '#21808D' }}>₹{selectedOrder.totalAmount}</Title></Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={12}>
                <Text strong>Order Status: </Text>
                <Tag color="#108ee9">{selectedOrder.status}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Payment Status: </Text>
                <Tag color={selectedOrder.payment.status === "Confirmed" ? "green" : "orange"}>
                  {selectedOrder.payment.status}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
