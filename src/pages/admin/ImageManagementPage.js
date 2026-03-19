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
        message.error(response.message || 'Error fetching book list');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error fetching book list';
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
        message.error(response.message || 'Error fetching image list');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error fetching image list';
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
      message.warning('Please select a book first');
      return;
    }

    try {
      setUploadLoading(true);
      const files = fileList.map(file => file.originFileObj || file);
      const response = await adminBookImagesService.uploadBookImages(selectedBookId, files);

      if (response.success) {
        message.success(response.message || 'Images uploaded successfully');
        fetchImages(selectedBookId);
      } else {
        message.error(response.message || 'Error uploading images');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error uploading images';
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
        message.success(response.message || 'Image deleted successfully');
        fetchImages(selectedBookId);
      } else {
        message.error(response.message || 'Error deleting image');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting image';
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
        message.success(response.message || 'Main image set successfully');
        fetchImages(selectedBookId);
      } else {
        message.error(response.message || 'Error setting main image');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error setting main image';
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
    name: 'image',
    multiple: false,
    accept: 'image/*',
    listType: 'picture-card',
    beforeUpload: (file) => {
      handleUploadImages([file]);
      return false;
    },
    onChange: () => {},
    showUploadList: false,
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'url',
      key: 'url',
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
          {record.isCover && (
            <Tag
              color="gold"
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                fontSize: '10px',
              }}
            >
              <StarFilled /> Main
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      ellipsis: true,
      render: (_, record) => record.filename || `image_${record._id?.slice(-6) || ''}`,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size) => {
        if (!size) return '-';
        const sizeInMB = (size / 1024 / 1024).toFixed(2);
        return `${sizeInMB} MB`;
      },
    },
    {
      title: 'Format',
      dataIndex: 'mimeType',
      key: 'mimeType',
      render: (mimeType, record) => {
        const format = mimeType?.split('/')[1]?.toUpperCase() || 'IMAGE';
        return <Tag color="blue">{format || record.url?.split('.').pop()?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'isCover',
      key: 'isCover',
      render: (isMain) => (
        <Tag color={isMain ? 'gold' : 'default'}>
          {isMain ? 'Main Image' : 'Sub Image'}
        </Tag>
      ),
    },
    {
      title: 'Uploaded At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Image">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePreview(record.url, record.filename)}
            />
          </Tooltip>
          {!record.isCover && (
            <Tooltip title="Set as Main">
              <Button
                icon={<StarOutlined />}
                size="small"
                onClick={() => handleSetMainImage(record._id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Are you sure you want to delete this image?"
            onConfirm={() => handleDeleteImage(record._id)}
            okText="Delete"
            cancelText="Cancel"
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
              Book Image Management
            </Title>
          </Col>
          <Col>
            <Space>
              <Select
                placeholder="Select book"
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
                  Upload Image
                </Button>
              </Upload>
            </Space>
          </Col>
        </Row>

        {selectedBook && (
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
            <Title level={4} style={{ margin: 0 }}>
              Book: {selectedBook.title}
            </Title>
            <p style={{ margin: 0, color: '#666' }}>
              Author: {selectedBook.authors?.join(', ')}
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
              `${range[0]}-${range[1]} of ${total} images`,
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
        message="Uploading images..."
        tip="Please wait a moment"
      />

      <LoadingModal
        visible={deleteLoading}
        message="Deleting image..."
        tip="Please wait a moment"
      />
    </div>
  );
};

export default ImageManagementPage;
