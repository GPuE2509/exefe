import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tag,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { adminGenresService } from '../../services/adminService';
import LoadingModal from '../../components/LoadingModal';

const { Title } = Typography;

const GenreManagementPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await adminGenresService.getGenres();
      
      if (response.success) {
        setGenres(response.data?.genres || []);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách thể loại');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách thể loại';
      message.error(errorMessage);
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = () => {
    setEditingGenre(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditGenre = (genre) => {
    setEditingGenre(genre);
    form.setFieldsValue({
      name: genre.name,
      description: genre.description,
      code: genre.code,
      sortOrder: genre.sortOrder,
    });
    setModalVisible(true);
  };

  const handleDeleteGenre = async (genreId) => {
    try {
      setDeleteLoading(true);
      const response = await adminGenresService.deleteGenre(genreId);
      
      if (response.success) {
        message.success(response.message || 'Xóa thể loại thành công');
        fetchGenres();
      } else {
        message.error(response.message || 'Lỗi khi xóa thể loại');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa thể loại';
      message.error(errorMessage);
      console.error('Error deleting genre:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true);
      let response;
      if (editingGenre) {
        response = await adminGenresService.updateGenre(editingGenre._id, values);
      } else {
        response = await adminGenresService.createGenre(values);
      }

      if (response.success) {
        message.success(response.message || (editingGenre ? 'Cập nhật thể loại thành công' : 'Thêm thể loại thành công'));
        setModalVisible(false);
        fetchGenres();
      } else {
        message.error(response.message || (editingGenre ? 'Lỗi khi cập nhật thể loại' : 'Lỗi khi thêm thể loại'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || (editingGenre ? 'Lỗi khi cập nhật thể loại' : 'Lỗi khi thêm thể loại');
      message.error(errorMessage);
      console.error('Error saving genre:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <strong>{name}</strong>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
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
            onClick={() => handleEditGenre(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thể loại này?"
            description="Việc này có thể ảnh hưởng đến các sách thuộc thể loại này."
            onConfirm={() => handleDeleteGenre(record._id)}
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

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý thể loại
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddGenre}
            >
              Thêm thể loại mới
            </Button>
          </Col>
        </Row>

         <Table
           columns={columns}
           dataSource={genres || []}
           rowKey="_id"
           loading={loading}
           pagination={{
             pageSize: 10,
             showSizeChanger: true,
             showQuickJumper: true,
             showTotal: (total, range) =>
               `${range[0]}-${range[1]} của ${total} thể loại`,
           }}
         />
      </Card>

      <Modal
        title={editingGenre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã thể loại"
                rules={[{ required: true, message: 'Vui lòng nhập mã thể loại' }]}
              >
                <Input placeholder="Nhập mã thể loại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label="Thứ tự sắp xếp"
                rules={[{ required: true, message: 'Vui lòng nhập thứ tự sắp xếp' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập thứ tự"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="name"
            label="Tên thể loại"
            rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
          >
            <Input placeholder="Nhập tên thể loại" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả thể loại"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingGenre ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Loading Modals */}
      <LoadingModal 
        visible={submitLoading}
        message={editingGenre ? 'Đang cập nhật thể loại...' : 'Đang thêm thể loại mới...'}
        tip="Vui lòng đợi trong giây lát"
      />
      
      <LoadingModal 
        visible={deleteLoading}
        message="Đang xóa thể loại..."
        tip="Vui lòng đợi trong giây lát"
      />
    </div>
  );
};

export default GenreManagementPage;
