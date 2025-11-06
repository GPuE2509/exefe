import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Progress,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { adminBookAudiosService, adminBooksService, adminAudiosService } from '../../services/adminService';
import LoadingModal from '../../components/LoadingModal';

const { Title } = Typography;
const { Option } = Select;

const AudioManagementPage = () => {
  const [audios, setAudios] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAudio, setEditingAudio] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} audio`,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBookId) {
      fetchAudios(selectedBookId);
    }
  }, [selectedBookId]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
    };
  }, [audioRef]);

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

  const fetchAudios = async (bookId, page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminBookAudiosService.getBookAudios(bookId, {
        page,
        limit: pageSize
      });
      
      if (response.success) {
        setAudios(response.data?.audioItems || []);
        
        // Update pagination
        const paginationData = response.data?.pagination;
        if (paginationData) {
          setPagination(prev => ({
            ...prev,
            current: paginationData.currentPage || 1,
            total: paginationData.totalAudios || 0,
            pageSize: pageSize,
          }));
        }
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách audio');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách audio';
      message.error(errorMessage);
      console.error('Error fetching audios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (bookId) => {
    setSelectedBookId(bookId);
    setAudios([]);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: 0,
    }));
  };

  const handleAddAudio = () => {
    if (!selectedBookId) {
      message.warning('Vui lòng chọn sách trước');
      return;
    }
    setEditingAudio(null);
    setUploadedFile(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditAudio = (audio) => {
    setEditingAudio(audio);
    form.setFieldsValue({
      term: audio.term,
      description: audio.description,
      qrToken: audio.qrToken,
    });
    setModalVisible(true);
  };

  const handleDeleteAudio = async (audioId) => {
    try {
      setDeleteLoading(true);
      const response = await adminAudiosService.deleteAudio(audioId);
      
      if (response.success) {
        message.success(response.message || 'Xóa audio thành công');
        fetchAudios(selectedBookId, pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Lỗi khi xóa audio');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa audio';
      message.error(errorMessage);
      console.error('Error deleting audio:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true);
      
      if (!selectedBookId) {
        message.error('Vui lòng chọn sách');
        return;
      }

      if (!uploadedFile && !editingAudio) {
        message.error('Vui lòng chọn file audio');
        return;
      }

      const audioData = {
        ...values,
        book: selectedBookId,
      };

      let response;
      if (editingAudio) {
        // Update existing audio
        response = await adminBookAudiosService.updateBookAudio(editingAudio._id, audioData);
      } else {
        // Create new audio with file upload
        response = await adminBookAudiosService.uploadAudioFile(selectedBookId, uploadedFile, values.term);
      }

      if (response.success) {
        message.success(response.message || (editingAudio ? 'Cập nhật audio thành công' : 'Thêm audio thành công'));
        setModalVisible(false);
        setUploadedFile(null);
        form.resetFields();
        fetchAudios(selectedBookId, pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || (editingAudio ? 'Lỗi khi cập nhật audio' : 'Lỗi khi thêm audio'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || (editingAudio ? 'Lỗi khi cập nhật audio' : 'Lỗi khi thêm audio');
      message.error(errorMessage);
      console.error('Error saving audio:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAudioUpload = (file) => {
    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Chỉ hỗ trợ file audio (MP3, WAV, M4A)');
      return false;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error('File quá lớn. Kích thước tối đa là 10MB');
      return false;
    }

    setUploadedFile(file);
    message.success(`Đã chọn file: ${file.name}`);
    return false; // Prevent default upload
  };

  const handlePlayAudio = (audioUrl) => {
    // Stop current audio if playing
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }

    if (playingAudio === audioUrl) {
      // Stop playing
      setPlayingAudio(null);
      setAudioRef(null);
      setAudioLoading(null);
    } else {
      // Start loading and playing new audio
      setAudioLoading(audioUrl);
      const audio = new Audio(audioUrl);
      
      // Handle when audio is ready to play
      audio.oncanplay = () => {
        setAudioLoading(null);
      };
      
      audio.play().then(() => {
        setPlayingAudio(audioUrl);
        setAudioRef(audio);
        
        // Handle audio end
        audio.onended = () => {
          setPlayingAudio(null);
          setAudioRef(null);
          setAudioLoading(null);
        };
        
        // Handle audio error
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          message.error('Không thể phát audio này');
          setPlayingAudio(null);
          setAudioRef(null);
          setAudioLoading(null);
        };
      }).catch((error) => {
        console.error('Audio play error:', error);
        message.error('Không thể phát audio này. Có thể file không tồn tại hoặc bị lỗi.');
        setPlayingAudio(null);
        setAudioRef(null);
        setAudioLoading(null);
      });
    }
  };

  const handleDownloadAudio = async (audioUrl, term) => {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get file extension from URL or default to mp3
      const urlParts = audioUrl.split('.');
      const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0] : 'mp3';
      
      link.download = `${term || 'audio'}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('Đã tải audio thành công');
    } catch (error) {
      console.error('Download error:', error);
      message.error('Không thể tải audio này');
    }
  };

  const handleTableChange = (paginationConfig) => {
    if (selectedBookId) {
      fetchAudios(selectedBookId, paginationConfig.current, paginationConfig.pageSize);
    }
  };

  const generateQRToken = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `QR_${random.toUpperCase()}_${timestamp}`;
  };

  const columns = [
    {
      title: 'Từ vựng/Tiêu đề',
      dataIndex: 'term',
      key: 'term',
      ellipsis: true,
    },
    {
      title: 'QR Token',
      dataIndex: 'qrToken',
      key: 'qrToken',
      width: 150,
      render: (qrToken) => (
        <Tag color="blue" style={{ fontSize: '10px' }}>
          {qrToken?.substring(0, 20)}...
        </Tag>
      ),
    },
    {
      title: 'QR Code',
      dataIndex: 'qrUrl',
      key: 'qrUrl',
      width: 100,
      responsive: ['md'],
      render: (qrUrl) => (
        qrUrl ? (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={qrUrl} 
              alt="QR Code" 
              style={{ 
                width: '40px', 
                height: '40px', 
                objectFit: 'contain',
                cursor: 'pointer',
                border: '1px solid #d9d9d9',
                borderRadius: '4px'
              }}
              onClick={() => window.open(qrUrl, '_blank')}
            />
            <br />
            <Button 
              size="small" 
              type="link" 
              href={qrUrl}
              download
              style={{ padding: 0, fontSize: '10px', marginTop: '4px' }}
            >
              Tải QR
            </Button>
          </div>
        ) : (
          <span style={{ color: '#ccc' }}>Chưa có</span>
        )
      ),
    },
    {
      title: 'Audio',
      dataIndex: 'audioUrl',
      key: 'audioUrl',
      render: (audioUrl, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={playingAudio === audioUrl ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handlePlayAudio(audioUrl)}
            disabled={!audioUrl}
            loading={audioLoading === audioUrl}
          >
            {audioLoading === audioUrl ? 'Đang tải...' : playingAudio === audioUrl ? 'Dừng' : 'Phát'}
          </Button>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadAudio(audioUrl, record.term)}
            disabled={!audioUrl}
          >
            Tải
          </Button>
        </Space>
      ),
    },
    {
      title: 'Lượt phát',
      dataIndex: 'playCount',
      key: 'playCount',
      render: (count) => (
        <Progress
          percent={Math.min((count || 0) * 10, 100)}
          size="small"
          format={() => count || 0}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditAudio(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa audio này?"
            onConfirm={() => handleDeleteAudio(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
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
              Quản lý Audio sách
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddAudio}
                disabled={!selectedBookId}
              >
                Thêm audio mới
              </Button>
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
           dataSource={audios || []}
           rowKey="_id"
           loading={loading}
           pagination={pagination}
           onChange={handleTableChange}
           scroll={{ x: 800 }}
         />
      </Card>

      <Modal
        title={editingAudio ? 'Chỉnh sửa audio' : 'Thêm audio mới'}
        open={modalVisible}
        onCancel={() => !submitLoading && setModalVisible(false)}
        footer={null}
        width={600}
        closable={!submitLoading}
        maskClosable={!submitLoading}
      >
        <Spin spinning={submitLoading} tip={editingAudio ? 'Đang cập nhật audio...' : 'Đang tạo audio mới...'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
          <Form.Item
            name="term"
            label="Từ vựng/Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập từ vựng/tiêu đề' }]}
          >
            <Input placeholder="Nhập từ vựng hoặc tiêu đề audio" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả audio" />
          </Form.Item>

          <Form.Item
            name="qrToken"
            label="QR Token"
            rules={[{message: 'Vui lòng nhập QR Token' }]}
          >
            <Input
              placeholder="Nhập QR Token hoặc để trống để tự động tạo"
              suffix={
                <Button
                  size="small"
                  onClick={() => form.setFieldsValue({ qrToken: generateQRToken() })}
                >
                  Tạo QR
                </Button>
              }
            />
          </Form.Item>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <Title level={5}>Tải file audio</Title>
            <Upload
              accept="audio/*"
              beforeUpload={(file) => {
                handleAudioUpload(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                Chọn file audio
              </Button>
            </Upload>
            
            {uploadedFile && (
              <div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                <Space>
                  <AudioOutlined />
                  <span>{uploadedFile.name}</span>
                  <span style={{ color: '#666' }}>
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <Button 
                    size="small" 
                    type="text" 
                    danger
                    onClick={() => setUploadedFile(null)}
                  >
                    Xóa
                  </Button>
                </Space>
              </div>
            )}
            
            <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
              Hỗ trợ định dạng: MP3, WAV, M4A (tối đa 10MB)
            </p>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => setModalVisible(false)}
                disabled={submitLoading}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={submitLoading}
              >
                {editingAudio ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>

      {/* Loading Modals */}
      <LoadingModal 
        visible={deleteLoading}
        message="Đang xóa audio..."
        tip="Vui lòng đợi trong giây lát"
      />
    </div>
  );
};

export default AudioManagementPage;
