import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Upload,
  Image,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Select,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { adminBookImagesService, adminBooksService } from '../../services/adminService';
import LoadingModal from '../../components/LoadingModal';

const { Title } = Typography;
const { Option } = Select;

const ImageManagementPage = () => {
  const [images, setImages] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBookId) {
      fetchImages(selectedBookId);
    }
  }, [selectedBookId]);

  const fetchBooks = async () => {
    try {
      const response = await adminBooksService.getBooks();
      
      if (response.success) {
        setBooks(response.data?.books || []);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách sách');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách sách';
      message.error(errorMessage);
      console.error('Error fetching books:', error);
    }
  };

  const fetchImages = async (bookId) => {
    try {
      setLoading(true);
      const response = await adminBookImagesService.getBookImages(bookId);
      
      if (response.success) {
        setImages(response.data || []);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách ảnh');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách ảnh';
      message.error(errorMessage);
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (bookId) => {
    setSelectedBookId(bookId);
    setImages([]);
  };

  const handleUploadImages = async (fileList) => {
    if (!selectedBookId) {
      message.warning('Vui lòng chọn sách trước');
      return;
    }

    try {
      setUploadLoading(true);
      const files = fileList.map(file => file.originFileObj || file);
      const response = await adminBookImagesService.uploadBookImages(selectedBookId, files);
      
      if (response.success) {
        message.success(response.message || 'Tải ảnh thành công');
        fetchImages(selectedBookId);
      } else {
        message.error(response.message || 'Lỗi khi tải ảnh');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải ảnh';
      message.error(errorMessage);
      console.error('Error uploading images:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      setDeleteLoading(true);
      const response = await adminBookImagesService.deleteBookImage(selectedBookId, imageId);
      
      if (response.success) {
        message.success(response.message || 'Xóa ảnh thành công');
        fetchImages(selectedBookId);
      } else {
        message.error(response.message || 'Lỗi khi xóa ảnh');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa ảnh';
      message.error(errorMessage);
      console.error('Error deleting image:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      const response = await adminBookImagesService.setMainImage(selectedBookId, imageId);
      
      if (response.success) {
        message.success(response.message || 'Đặt ảnh chính thành công');
        fetchImages(selectedBookId);
      } else {
        message.error(response.message || 'Lỗi khi đặt ảnh chính');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi đặt ảnh chính';
      message.error(errorMessage);
      console.error('Error setting main image:', error);
    }
  };

  const handlePreview = (imageUrl, title) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
    setPreviewTitle(title);
  };

  const uploadProps = {
    name: 'images',
    multiple: true,
    accept: 'image/*',
    listType: 'picture-card',
    beforeUpload: () => false,
    onChange: ({ fileList }) => {
      const validFiles = fileList.filter(file => file.status === 'ready');
      if (validFiles.length > 0) {
        handleUploadImages(validFiles);
      }
    },
    showUploadList: false,
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (imageUrl, record) => (
        <div style={{ position: 'relative' }}>
          <Image
            width={100}
            height={80}
            src={imageUrl}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            preview={false}
          />
          {record.isMain && (
            <Tag
              color="gold"
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                fontSize: '10px',
              }}
            >
              <StarFilled /> Chính
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Tên file',
      dataIndex: 'filename',
      key: 'filename',
      ellipsis: true,
    },
    {
      title: 'Kích thước',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size) => {
        if (!size) return '-';
        const sizeInMB = (size / 1024 / 1024).toFixed(2);
        return `${sizeInMB} MB`;
      },
    },
    {
      title: 'Định dạng',
      dataIndex: 'mimeType',
      key: 'mimeType',
      render: (mimeType) => {
        const format = mimeType?.split('/')[1]?.toUpperCase();
        return <Tag color="blue">{format}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isMain',
      key: 'isMain',
      render: (isMain) => (
        <Tag color={isMain ? 'gold' : 'default'}>
          {isMain ? 'Ảnh chính' : 'Ảnh phụ'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tải',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem ảnh">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePreview(record.imageUrl, record.filename)}
            />
          </Tooltip>
          {!record.isMain && (
            <Tooltip title="Đặt làm ảnh chính">
              <Button
                icon={<StarOutlined />}
                size="small"
                onClick={() => handleSetMainImage(record._id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa ảnh này?"
            onConfirm={() => handleDeleteImage(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const selectedBook = books.find(book => book._id === selectedBookId);

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý ảnh sách
            </Title>
          </Col>
          <Col>
            <Space>
              <Select
                placeholder="Chọn sách"
                style={{ width: 200 }}
                onChange={handleBookChange}
                value={selectedBookId}
              >
                {books.map(book => (
                  <Option key={book._id} value={book._id}>
                    {book.title}
                  </Option>
                ))}
              </Select>
              <Upload {...uploadProps}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  disabled={!selectedBookId}
                >
                  Tải ảnh
                </Button>
              </Upload>
            </Space>
          </Col>
        </Row>

        {selectedBook && (
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
            <Title level={4} style={{ margin: 0 }}>
              Sách: {selectedBook.title}
            </Title>
            <p style={{ margin: 0, color: '#666' }}>
              Tác giả: {selectedBook.authors?.join(', ')}
            </p>
          </div>
        )}

         <Table
           columns={columns}
           dataSource={images || []}
           rowKey="_id"
           loading={loading}
           pagination={{
             pageSize: 10,
             showSizeChanger: true,
             showQuickJumper: true,
             showTotal: (total, range) =>
               `${range[0]}-${range[1]} của ${total} ảnh`,
           }}
         />
      </Card>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <Image
          alt={previewTitle}
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>

      {/* Loading Modals */}
      <LoadingModal 
        visible={uploadLoading}
        message="Đang tải ảnh..."
        tip="Vui lòng đợi trong giây lát"
      />
      
      <LoadingModal 
        visible={deleteLoading}
        message="Đang xóa ảnh..."
        tip="Vui lòng đợi trong giây lát"
      />
    </div>
  );
};

export default ImageManagementPage;
