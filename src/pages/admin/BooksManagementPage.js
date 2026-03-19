import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Image,
  Tag,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { adminBooksService, adminGenresService } from '../../services/adminService';
import LoadingModal from '../../components/LoadingModal';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const BooksManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} books`,
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminBooksService.getBooks({
        page,
        limit: pageSize
      });

      if (response.success) {
        // Update books
        setBooks(response.data?.books || []);

        // Update pagination
        const paginationData = response.data?.pagination;
        setPagination(prev => ({
          ...prev,
          current: paginationData?.currentPage || 1,
          total: paginationData?.totalBooks || 0,
          pageSize: pageSize,
        }));
      } else {
        message.error(response.message || 'Error fetching book list');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error fetching book list';
      message.error(errorMessage);
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await adminGenresService.getGenres({
        limit: 100, // Get all genres without pagination for select options
        sort: 'name',
        order: 'asc'
      });

      if (response.success) {
        setGenres(response.data?.genres || []);
      } else {
        console.error('Error fetching genres:', response.message);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    form.setFieldsValue({
      title: book.title,
      authors: book.authors?.join(', '),
      description: book.description,
      priceList: book.price?.list || book.price,
      priceSale: book.price?.sale,
      currency: book.price?.currency || 'VND',
      genre: book.genres?.[0]?._id || book.genres?.[0], // Map first genre to single genre field
      publisher: book.publisher,
      publishedAt: book.publishedAt,
      stock: book.inventory?.stock || 0,
      sku: book.inventory?.sku || '',
      isActive: book.isActive,
    });
    setModalVisible(true);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteLoading(true);
      const response = await adminBooksService.deleteBook(bookId);

      if (response.success) {
        message.success(response.message || 'Book deleted successfully');
        fetchBooks(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error deleting book');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting book';
      message.error(errorMessage);
      console.error('Error deleting book:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true);

      // Ensure all required fields are present
      const bookData = {
        title: values.title,
        description: values.description,
        authors: values.authors ? values.authors.split(',').map(author => author.trim()) : [],
        price: {
          list: values.priceList,
          sale: values.priceSale || values.priceList, // Default sale price to list price if not provided
          currency: values.currency
        },
        genres: values.genre ? [values.genre] : [], // Fix mapping from form field 'genre' to 'genres' array
        publisher: values.publisher,
        publishedAt: values.publishedAt,
        inventory: {
          stock: values.stock || 0,
          sku: values.sku || `SKU${Date.now()}`
        },
      };

      // Debug log
      console.log('Submitting book data:', bookData);

      let response;
      if (editingBook) {
        response = await adminBooksService.updateBook(editingBook._id, bookData);
      } else {
        response = await adminBooksService.createBook(bookData);
      }

      if (response.success) {
        message.success(response.message || (editingBook ? 'Book updated successfully' : 'Book created successfully'));
        setModalVisible(false);
        fetchBooks(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || (editingBook ? 'Error updating book' : 'Error adding book'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || (editingBook ? 'Error updating book' : 'Error adding book');
      message.error(errorMessage);
      console.error('Error saving book:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCoverUpload = async (file, bookId) => {
    try {
      setUploadLoading(true);
      const response = await adminBooksService.uploadBookCover(bookId, file);

      if (response.success) {
        message.success(response.message || 'Cover uploaded successfully');
        fetchBooks(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error uploading cover');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error uploading cover';
      message.error(errorMessage);
      console.error('Error uploading cover:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleTableChange = (paginationConfig) => {
    fetchBooks(paginationConfig.current, paginationConfig.pageSize);
  };

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 80,
      responsive: ['md'],
      render: (image) => (
        <Image
          width={60}
          height={80}
          src={image}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Author',
      dataIndex: 'authors',
      key: 'authors',
      responsive: ['lg'],
      render: (authors) => authors?.join(', ') || '-',
    },
    {
      title: 'Genre',
      dataIndex: 'genres',
      key: 'genres',
      responsive: ['xl'],
      render: (genres) => genres?.map(genre => genre.name).join(', ') || '-',
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      render: (_, record) => {
        const { price } = record;
        if (!price) return '-';
        return (
          <div>
            <div style={{ textDecoration: price.sale ? 'line-through' : 'none', color: '#999', fontSize: '12px' }}>
              {price.list?.toLocaleString()} {price.currency || 'VNĐ'}
            </div>
            {price.sale && (
              <div style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '12px' }}>
                {price.sale.toLocaleString()} {price.currency || 'VNĐ'}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Stock',
      dataIndex: 'inventory',
      key: 'inventory',
      width: 80,
      responsive: ['lg'],
      render: (inventory) => inventory?.stock || 0,
    },
    {
      title: 'Rating',
      key: 'rating',
      width: 100,
      responsive: ['xl'],
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>{record.ratingAvg || 0}/5</div>
          <div style={{ fontSize: '10px', color: '#999' }}>
            ({record.ratingCount || 0})
          </div>
        </div>
      ),
    },
    {
      title: 'Audio',
      dataIndex: 'vocabAudioCount',
      key: 'vocabAudioCount',
      width: 60,
      responsive: ['xl'],
      render: (count) => count || 0,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      responsive: ['md'],
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} style={{ fontSize: '10px' }}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      responsive: ['lg'],
      render: (date) => (
        <div style={{ fontSize: '12px' }}>
          {new Date(date).toLocaleDateString('en-US')}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => window.open(`/book/${record._id}`, '_blank')}
            className="mobile-hide-text"
          >
            <span className="btn-text">View</span>
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditBook(record)}
            className="mobile-hide-text"
          >
            <span className="btn-text">Edit</span>
          </Button>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleCoverUpload(file, record._id);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} size="small" className="mobile-hide-text">
              <span className="btn-text">Image</span>
            </Button>
          </Upload>
          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => handleDeleteBook(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="mobile-hide-text"
            >
              <span className="btn-text">Delete</span>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Book Management
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBook}
            >
              Add New Book
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={books || []}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{
            ...pagination,
            responsive: true,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingBook ? 'Edit Book' : 'Add New Book'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '800px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter book title' }]}
              >
                <Input placeholder="Enter book title" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="authors"
                label="Author"
                rules={[{ required: true, message: 'Please enter author' }]}
              >
                <Input placeholder="Author 1, Author 2, ..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter book description" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item
                name="priceList"
                label="List Price"
                rules={[{ required: true, message: 'Please enter list price' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="List Price"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                name="priceSale"
                label="Sale Price"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Sale Price"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={4}>
              <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true, message: 'Please select currency' }]}
              >
                <Select placeholder="Select currency">
                  <Option value="VND">VNĐ</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="genre"
                label="Genre"
                rules={[{ required: true, message: 'Please select genre' }]}
              >
                <Select
                  placeholder="Select genre"
                  loading={genres.length === 0}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {genres.map(genre => (
                    <Option key={genre._id} value={genre._id}>
                      {genre.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="publisher"
                label="Publisher"
              >
                <Input placeholder="Enter publisher" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="stock"
                label="Stock Quantity"
                rules={[{ required: true, message: 'Please enter stock quantity' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter quantity" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="sku"
                label="SKU"
              >
                <Input placeholder="Enter SKU" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingBook ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Loading Modals */}
      <LoadingModal
        visible={submitLoading}
        message={editingBook ? 'Updating book...' : 'Adding new book...'}
        tip="Please wait a moment"
      />

      <LoadingModal
        visible={deleteLoading}
        message="Deleting book..."
        tip="Please wait a moment"
      />

      <LoadingModal
        visible={uploadLoading}
        message="Uploading cover..."
        tip="Please wait a moment"
      />
    </div>
  );
};

export default BooksManagementPage;