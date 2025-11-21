import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Typography,
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
  Table,
  Tag,
  Pagination,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import {
  uploadAssets,
  fetchProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import { csvToArray, getProductId } from "../utils/helpers";

const { TextArea } = Input;

const booleanAttributes = [
  { label: "Exclusive", value: "exclusive" },
  { label: "Best Seller", value: "bestSeller" },
  { label: "New Arrival", value: "newArrival" },
];

const initialFormState = {
  productId: "",
  title: "",
  category: "Women",
  subCategory: "",
  exclusive: false,
  bestSeller: false,
  newArrival: false,
  price: null,
  originalPrice: null,
  discountPercentage: null,
  rating: null,
  stock: null,
  sizes: null,
  colors: "",
  material: "",
  fabric: null,
  description: "",
  details: "",
  tags: "",
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
  const [productId, setProductId] = useState();
  const [mongoId, setMongoId] = useState();
  const [categoryFilter, setCategoryFilter] = useState("Women");
  const [filterBy, setfilterBy] = useState("");

  useEffect(() => {
    setProductId(getProductId());
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
      const lastId = data.at(-1)?.productId;
      setProductId(getProductId(lastId));
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
      colors: product.colors?.join(","),
      tags: product.tags?.join(","),
    });
    setMongoId(product._id);
    setProductId(product.productId);
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scrolling
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setMongoId(null);
    setUploadedImages([]);
    setEditing(false);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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
      productId,
      fabric: values.fabric ? values.fabric[0] : "",
      sizes: values.sizes,
      colors: csvToArray(values.colors),
      tags: csvToArray(values.tags),
      images: uploadedImages,
    };
    try {
      if (editing) {
        await updateProduct({ ...productData, _id: mongoId });
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
      const data = await uploadAssets(file);
      if (!data.success) throw new Error(data.error || "Upload failed");
      setUploadedImages((prev) => [...prev, data.raw_url]);
      onSuccess("ok");
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handlePreview = async (file) => {
    window.open(file.url, "_blank");
  };

  const handleRemove = (file) => {
    setUploadedImages((prev) => prev.filter((img) => img !== file.url));
  };

  // Filtered products for search and category filter

  const filteredProducts = products
    .filter(
      (p) =>
        p.title.toLowerCase().includes(filterBy.toLowerCase()) ??
        p.productId.toString().includes(filterBy.toString())
    )
    .filter((p) => (categoryFilter ? p.category === categoryFilter : true));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { title: "Product ID", key: "productId", dataIndex: "productId" },
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div>
          <Typography.Text strong>{record.title}</Typography.Text>
          <br />
          <Typography.Text type="secondary">{record.category}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "images",
      align: 'center',
      key: "images",
      render: (images) => (
        <img
          src={images?.[0]}
          alt="product"
          style={{
            width: 70,
            height: 70,
            borderRadius: 8,
            objectFit: "cover",
            border: "1px solid #f0f0f0",
          }}
        />
      ),
    },
    
    {
      title: "Price (INR)",
      align: 'center',
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <Typography.Text strong>  {price}</Typography.Text>,
    },
    {
      title: "Stock",
      align: 'center',
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) =>
        stock === 0 ? (
          <Badge color="red" text="Out of Stock" />
        ) : (
          <Badge color="green" text="In Stock" />
        ),
    },
    {
      title: "Tag",
      align: 'center',
      key: "tag",
      render: (row) =>
        row.newArrival ? (
          <Tag color="green">New</Tag>
        ) : row.bestSeller ? (
          <Tag color="blue">Best Seller</Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: 'center',
      render: (row) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedProduct(row);
              setModalVisible(true);
            }}
          >
            Details
          </Button>
          <EditOutlined
            style={{ color: "#1677ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => handleEdit(row)}
          />
          <DeleteOutlined
            style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            onClick={() => handleDelete(row._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title
        level={3}
        style={{ textAlign: "center", marginBottom: 30 }}
      >
        Product Manager
      </Typography.Title>

      {/* ---------------- PRODUCT FORM ---------------- */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 40,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialFormState}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Form.Item label="Product ID" name="productId">
                {productId}
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select options={[{ label: "Women", value: "Women" }]} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Sub Category"
                name="subCategory"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Sub Category"
                  options={[
                    { label: "Salwar Materials", value: "Salwar Materials" },
                    { label: "Ready to Wear", value: "Ready to Wear" },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Attributes */}
            <Col span={24}>
              <label style={{ fontWeight: 600 }}>Attributes</label>
              <Row>
                {booleanAttributes.map((attr) => (
                  <Col xs={24} sm={8} md={4} key={attr}>
                    <Form.Item
                      name={attr.value}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox style={{ marginBottom: 10 }}>
                        {attr.label}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Col>

            {/* Sizes, Colors, Tags */}
            <Col xs={24} md={6}>
              <Form.Item
                label="Sizes"
                name="sizes"
                rules={[{ required: false }]}
              >
                <Select
                  placeholder="S, M, L,..."
                  mode="multiple"
                  allowClear
                  options={[
                    { label: "XS", value: "XS" },
                    { label: "S", value: "S" },
                    { label: "M", value: "M" },
                    { label: "L", value: "L" },
                    { label: "XL", value: "XL" },
                    { label: "XXL", value: "XXL" },
                    { label: "XXXL", value: "XXXL" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Colors" name="colors">
                <Input placeholder="Red" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Tags" name="tags">
                <Input placeholder="New" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Fabric"
                name="fabric"
                rules={[{ required: false }]}
              >
                <Select
                  mode="tags"
                  maxCount={1} // <-- allows typing custom values
                  placeholder="Select or type fabric"
                  allowClear
                  options={[
                    { label: "Cotton", value: "Cotton" },
                    { label: "Silk Cotton", value: "Silk Cotton" },
                    { label: "Silk", value: "Silk" },
                    { label: "Organza", value: "Organza" },
                    { label: "Linen", value: "Linen" },
                    { label: "Georgette", value: "Georgette" },
                    { label: "Kota", value: "Kota" },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Numbers */}
            <Col xs={24} md={6}>
              <Form.Item
                label="Selling Price"
                name="price"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Actual Price"
                name="originalPrice"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.price !== currentValues.price ||
                  prevValues.originalPrice !== currentValues.originalPrice
                }
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const price = getFieldValue("price");
                  const originalPrice = getFieldValue("originalPrice");

                  let discount = null;
                  if (
                    price != null &&
                    originalPrice != null &&
                    originalPrice !== 0
                  ) {
                    discount = Math.round(
                      ((originalPrice - price) / originalPrice) * 100
                    );
                  }

                  // Update discount field
                  setFieldsValue({
                    discountPercentage: discount,
                  });

                  return (
                    <Form.Item label="Discount (%)" name="discountPercentage">
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                        readOnly
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
              {/* <Form.Item
                                label="Discount %"
                                name="discountPercentage"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} max={100} style={{ width: "100%" }} />
                            </Form.Item> */}
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Stock"
                name="stock"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Description and Details */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
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
                    uid: String(idx),
                    name: `Image-${idx}`,
                    status: "done",
                    url,
                  }))}
                  onPreview={handlePreview}
                  onRemove={handleRemove}
                >
                  <UploadOutlined /> Upload
                </Upload>
              </Form.Item>
            </Col>

            {/* Buttons */}
            <Col span={24}>
              <div style={{ textAlign: "right" }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {editing ? "Update Product" : "Add Product"}
                  </Button>
                  {editing && (
                    <Button onClick={handleCancel} danger>
                      Cancel
                    </Button>
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* ---------------- ADVANCED TABLE ---------------- */}

      <Typography.Title
        level={3}
        style={{ textAlign: "center", marginBottom: 30 }}
      >
        Product List
      </Typography.Title>
      <Row style={{ marginBottom: 16 }} gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search by Title, Product ID"
            value={filterBy}
            onChange={(e) => setfilterBy(e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by category"
            allowClear
            style={{ width: "100%" }}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
          >
            <Select.Option value="Women">Women</Select.Option>
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={paginatedProducts}
        rowKey="productId"
        bordered
        // expandable={{
        //   expandedRowRender: (record) => (
        //     <div>
        //       <Typography.Text>
        //         <strong>Sub Category:</strong> {record.subCategory}
        //       </Typography.Text>
        //       <br />
        //       <Typography.Text>
        //         <strong>Sizes:</strong> {record.sizes?.join(", ")}
        //       </Typography.Text>
        //       <br />
        //       <Typography.Text>
        //         <strong>Colors:</strong> {record.colors?.join(", ")}
        //       </Typography.Text>
        //     </div>
        //   ),
        // }}
        pagination={false}
      />

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={filteredProducts.length}
          pageSize={itemsPerPage}
          onChange={setCurrentPage}
          style={{ marginTop: 30, textAlign: "center" }}
        />
      )}

      {/* ---------------- PRODUCT DETAILS MODAL ---------------- */}
      <Modal
        open={modalVisible}
        title={selectedProduct?.title}
        onCancel={handleModalClose}
        footer={null}
        width={700}
        centered
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {selectedProduct && (
          <div>
            {selectedProduct.images?.length > 0 && (
              <Image
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                style={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
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
              <strong>Price:</strong> ₹{selectedProduct.price}{" "}
              {selectedProduct.originalPrice && (
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                    marginLeft: 8,
                  }}
                >
                  ₹{selectedProduct.originalPrice}
                </span>
              )}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Discount:</strong>{" "}
              {selectedProduct.discountPercentage || 0}%
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Stock:</strong> {selectedProduct.stock}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Sizes:</strong> {selectedProduct.sizes.join(", ")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Colors:</strong> {selectedProduct.colors.join(", ")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Description:</strong> {selectedProduct.description || "-"}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Details:</strong> {selectedProduct.details || "-"}
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
