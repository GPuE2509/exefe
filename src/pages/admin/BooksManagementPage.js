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
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sách`,
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
        message.error(response.message || 'Lỗi khi tải danh sách sách');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách sách';
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
        message.success(response.message || 'Xóa sách thành công');
        fetchBooks(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Lỗi khi xóa sách');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa sách';
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
        message.success(response.message || (editingBook ? 'Cập nhật sách thành công' : 'Thêm sách thành công'));
        setModalVisible(false);
        fetchBooks(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || (editingBook ? 'Lỗi khi cập nhật sách' : 'Lỗi khi thêm sách'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || (editingBook ? 'Lỗi khi cập nhật sách' : 'Lỗi khi thêm sách');
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
        message.success(response.message || 'Tải ảnh bìa thành công');
        fetchBooks(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Lỗi khi tải ảnh bìa');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải ảnh bìa';
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
      title: 'Ảnh bìa',
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
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Tác giả',
      dataIndex: 'authors',
      key: 'authors',
      responsive: ['lg'],
      render: (authors) => authors?.join(', ') || '-',
    },
    {
      title: 'Thể loại',
      dataIndex: 'genres',
      key: 'genres',
      responsive: ['xl'],
      render: (genres) => genres?.map(genre => genre.name).join(', ') || '-',
    },
    {
      title: 'Giá',
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
      title: 'Tồn kho',
      dataIndex: 'inventory',
      key: 'inventory',
      width: 80,
      responsive: ['lg'],
      render: (inventory) => inventory?.stock || 0,
    },
    {
      title: 'Đánh giá',
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
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      responsive: ['md'],
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} style={{ fontSize: '10px' }}>
          {isActive ? 'Hoạt động' : 'Dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      responsive: ['lg'],
      render: (date) => (
        <div style={{ fontSize: '12px' }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
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
            <span className="btn-text">Xem</span>
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditBook(record)}
            className="mobile-hide-text"
          >
            <span className="btn-text">Sửa</span>
          </Button>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleCoverUpload(file, record._id);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} size="small" className="mobile-hide-text">
              <span className="btn-text">Ảnh</span>
            </Button>
          </Upload>
          <Popconfirm
            title="Bạn có chắc muốn xóa sách này?"
            onConfirm={() => handleDeleteBook(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="mobile-hide-text"
            >
              <span className="btn-text">Xóa</span>
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
              Quản lý sách
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBook}
            >
              Thêm sách mới
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
        title={editingBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
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
                label="Tên sách"
                rules={[{ required: true, message: 'Vui lòng nhập tên sách' }]}
              >
                <Input placeholder="Nhập tên sách" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="authors"
                label="Tác giả"
                rules={[{ required: true, message: 'Vui lòng nhập tác giả' }]}
              >
                <Input placeholder="Tác giả 1, Tác giả 2, ..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả sách" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item
                name="priceList"
                label="Giá niêm yết"
                rules={[{ required: true, message: 'Vui lòng nhập giá niêm yết' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Giá niêm yết"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                name="priceSale"
                label="Giá khuyến mãi"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Giá khuyến mãi"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={4}>
              <Form.Item
                name="currency"
                label="Tiền tệ"
                rules={[{ required: true, message: 'Vui lòng chọn tiền tệ' }]}
              >
                <Select placeholder="Chọn tiền tệ">
                  <Option value="VND">VNĐ</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="genre"
                label="Thể loại"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
              >
                <Select 
                  placeholder="Chọn thể loại"
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
                label="Nhà xuất bản"
              >
                <Input placeholder="Nhập nhà xuất bản" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="stock"
                label="Số lượng tồn kho"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="sku"
                label="Mã SKU"
              >
                <Input placeholder="Nhập mã SKU" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingBook ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
          </Form>
        </Modal>

        {/* Loading Modals */}
        <LoadingModal 
          visible={submitLoading}
          message={editingBook ? 'Đang cập nhật sách...' : 'Đang thêm sách mới...'}
          tip="Vui lòng đợi trong giây lát"
        />
        
        <LoadingModal 
          visible={deleteLoading}
          message="Đang xóa sách..."
          tip="Vui lòng đợi trong giây lát"
        />
        
        <LoadingModal 
          visible={uploadLoading}
          message="Đang tải ảnh bìa..."
          tip="Vui lòng đợi trong giây lát"
        />
      </div>
    );
  };

export default BooksManagementPage;