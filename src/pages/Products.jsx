import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Badge,
    Button,
    Typography,
    Pagination,
    Spin,
    Form,
    Input,
    InputNumber,
    Select,
    Checkbox,
    Upload,
    Space,
    Modal,
    Image,
} from 'antd';
import {
    UploadOutlined,
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import {
    fetchProducts,
    saveProduct,
    updateProduct,
    deleteProduct,
} from '../api/productApi';
import { csvToArray } from '../utils/helpers';

const { TextArea } = Input;

const booleanAttributes = [
   {label:"Exclusive", value:'exclusive'},
   {label:"Best Seller", value:'bestSeller'},
   {label:"New Arrival", value:'newArrival'},
];

const initialFormState = {
    productId: '',
    title: '',
    category: 'Women',
    subCategory: '',
    
    exclusive: false,
    bestSeller: false,
    newArrival: false,
    price: null,
    originalPrice: null,
    discountPercentage: null,
    rating: null,
    stock: null,
    sizes: '',
    colors: '',
    material: '',
    fabric: '',
    description: '',
    details: '',
    tags: '',
};

export default function ProductsPage() {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const itemsPerPage = 6;

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditing(true);
        setUploadedImages(product.images || []);
        form.setFieldsValue({
            ...product,
            sizes: product.sizes?.join(', '),
            colors: product.colors?.join(', '),
            tags: product.tags?.join(', '),
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setUploadedImages([]);
        setEditing(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setLoading(true);
            await deleteProduct(id);
            loadProducts();
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const productData = {
            ...values,
            sizes: csvToArray(values.sizes),
            colors: csvToArray(values.colors),
            tags: csvToArray(values.tags),
            images: uploadedImages,
        };
        try {
            if (editing) {
                await updateProduct(productData);
            } else {
                await saveProduct(productData);
            }
            handleCancel();
            loadProducts();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async ({ file, onSuccess, onError }) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('http://localhost:3002/file-upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Upload failed');
            setUploadedImages((prev) => [...prev, data.raw_url]);
            onSuccess('ok');
        } catch (err) {
            onError(err);
        } finally {
            setLoading(false);
        }
    };

    const showDetails = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedProduct(null);
    };

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Spin spinning={loading}>
            <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
                Product Manager
            </Typography.Title>

            {/* ---------------- PRODUCT FORM ---------------- */}
            <Card
                style={{ borderRadius: 12, marginBottom: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={initialFormState}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                            <Form.Item label="Product ID" name="productId" rules={[{ required: true }]}>
                                <Input disabled={editing} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                                <Select options={[{ label: 'Women', value: 'Women' }]} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item label="Sub Category" name="subCategory" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Sub Category"
                                    options={[
                                        { label: 'Salwar Materials', value: 'Salwar Materials' },
                                        { label: 'Ready to Wear', value: 'Ready to Wear' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        {/* Attributes */}
                        <Col span={24}>
                            <label style={{ fontWeight: 600 }}>Attributes</label>
                            <Row>
                                {booleanAttributes.map((attr) => (
                                    <Col xs={12} sm={8} md={4} key={attr}>
                                        <Form.Item name={attr.value} valuePropName="checked" noStyle>
                                            <Checkbox style={{ marginBottom: 10 }}>{attr.label}</Checkbox>
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </Col>

                        {/* Sizes, Colors, Tags */}
                        <Col xs={24} md={8}>
                            <Form.Item label="Sizes" name="sizes">
                                <Input placeholder="S, M, L" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Colors" name="colors">
                                <Input placeholder="Red, Black" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Tags" name="tags">
                                <Input placeholder="cotton, summer" />
                            </Form.Item>
                        </Col>

                        {/* Numbers */}
                        <Col xs={12} md={6}>
                            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Item label="Original Price" name="originalPrice" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Item label="Discount %" name="discountPercentage" rules={[{ required: true }]}>
                                <InputNumber min={0} max={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        {/* Description and Details */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Details" name="details">
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>

                        {/* Image Upload */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Images">
                                <Upload
                                    customRequest={handleImageUpload}
                                    listType="picture-card"
                                    fileList={uploadedImages.map((url, idx) => ({
                                        uid: idx,
                                        name: 'Image',
                                        status: 'done',
                                        url,
                                    }))}
                                >
                                    <UploadOutlined /> Upload
                                </Upload>
                            </Form.Item>
                        </Col>

                        {/* Buttons */}
                        <Col span={24}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editing ? 'Update Product' : 'Add Product'}
                                </Button>
                                {editing && (
                                    <Button onClick={handleCancel} danger>
                                        Cancel
                                    </Button>
                                )}
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* ---------------- PRODUCT LIST ---------------- */}
            <Typography.Title level={3} style={{ marginBottom: 20 }}>
                Product List
            </Typography.Title>

            <Row gutter={[24, 24]}>
                {paginatedProducts.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                        <Badge.Ribbon
                            text={product.newArrival ? 'New' : product.bestSeller ? 'Best Seller' : ''}
                            color={product.newArrival ? 'green' : 'blue'}
                        >
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {/* Image */}
                                {product.images?.[0] && (
                                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
                                        />
                                    </div>
                                )}

                                {/* Info */}
                                <div style={{ marginBottom: 12 }}>
                                    <Typography.Title level={5} style={{ margin: 0 }}>
                                        {product.title}
                                    </Typography.Title>
                                    <Typography.Text type="secondary">{product.category}</Typography.Text>
                                    <br />
                                    <Typography.Text strong>₹{product.price}</Typography.Text>
                                    {product.stock === 0 && (
                                        <Badge count="Out of Stock" style={{ backgroundColor: '#ff4d4f', marginLeft: 8 }} />
                                    )}
                                </div>

                                {/* Actions */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 12,
                                    }}
                                >
                                    <Button
                                        icon={<InfoCircleOutlined />}
                                        size="small"
                                        onClick={() => showDetails(product)}
                                    >
                                        More Details
                                    </Button>
                                    <div>
                                        <EditOutlined
                                            style={{ color: '#1890ff', fontSize: 18, cursor: 'pointer', marginRight: 8 }}
                                            onClick={() => handleEdit(product)}
                                        />
                                        <DeleteOutlined
                                            style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }}
                                            onClick={() => handleDelete(product._id)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                ))}
            </Row>

            {totalPages > 1 && (
                <Pagination
                    current={currentPage}
                    total={products.length}
                    pageSize={itemsPerPage}
                    onChange={setCurrentPage}
                    style={{ marginTop: 30, textAlign: 'center' }}
                />
            )}

            {/* ---------------- PRODUCT DETAILS MODAL ---------------- */}
            {/* ---------------- PRODUCT DETAILS MODAL ---------------- */}
            <Modal
                open={modalVisible}
                title={selectedProduct?.title}
                onCancel={handleModalClose}
                footer={null}
                width={700}
                centered // Ensures modal is vertically centered
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }} // Internal scroll
            >
                {selectedProduct && (
                    <div>
                        {selectedProduct.images?.length > 0 && (
                            <Image
                                src={selectedProduct.images[0]}
                                alt={selectedProduct.title}
                                style={{
                                    width: '100%',
                                    height: 250,
                                    objectFit: 'cover',
                                    marginBottom: 20,
                                    borderRadius: 8,
                                }}
                                preview
                            />
                        )}
                        <Typography.Paragraph>
                            <strong>Category:</strong> {selectedProduct.category}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Sub Category:</strong> {selectedProduct.subCategory}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Price:</strong> ₹{selectedProduct.price}{' '}
                            {selectedProduct.originalPrice && (
                                <span
                                    style={{
                                        textDecoration: 'line-through',
                                        color: '#888',
                                        marginLeft: 8,
                                    }}
                                >
                                    ₹{selectedProduct.originalPrice}
                                </span>
                            )}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Discount:</strong> {selectedProduct.discountPercentage || 0}%
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Stock:</strong> {selectedProduct.stock}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Sizes:</strong> {selectedProduct.sizes}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Colors:</strong> {selectedProduct.colors}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Description:</strong> {selectedProduct.description || '-'}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <strong>Details:</strong> {selectedProduct.details || '-'}
                        </Typography.Paragraph>
                        {selectedProduct.tags && (
                            <Typography.Paragraph>
                                <strong>Tags:</strong> {selectedProduct.tags}
                            </Typography.Paragraph>
                        )}
                    </div>
                )}
            </Modal>

        </Spin>
    );
}
