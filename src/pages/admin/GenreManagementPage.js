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
        message.error(response.message || 'Error fetching genre list');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error fetching genre list';
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
        message.success(response.message || 'Genre deleted successfully');
        fetchGenres();
      } else {
        message.error(response.message || 'Error deleting genre');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting genre';
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
        message.success(response.message || (editingGenre ? 'Genre updated successfully' : 'Genre created successfully'));
        setModalVisible(false);
        fetchGenres();
      } else {
        message.error(response.message || (editingGenre ? 'Error updating genre' : 'Error adding genre'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || (editingGenre ? 'Error updating genre' : 'Error adding genre');
      message.error(errorMessage);
      console.error('Error saving genre:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'Genre Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <strong>{name}</strong>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditGenre(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this genre?"
            description="This may affect books belonging to this genre."
            onConfirm={() => handleDeleteGenre(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
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
              Genre Management
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddGenre}
            >
              Add New Genre
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
              `${range[0]}-${range[1]} of ${total} genres`,
          }}
        />
      </Card>

      <Modal
        title={editingGenre ? 'Edit Genre' : 'Add New Genre'}
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
                label="Genre Code"
                rules={[{ required: true, message: 'Please enter genre code' }]}
              >
                <Input placeholder="Enter genre code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label="Sort Order"
                rules={[{ required: true, message: 'Please enter sort order' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter order"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="name"
            label="Genre Name"
            rules={[{ required: true, message: 'Please enter genre name' }]}
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter genre description"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingGenre ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Loading Modals */}
      <LoadingModal
        visible={submitLoading}
        message={editingGenre ? 'Updating genre...' : 'Adding new genre...'}
        tip="Please wait a moment"
      />

      <LoadingModal
        visible={deleteLoading}
        message="Deleting genre..."
        tip="Please wait a moment"
      />
    </div>
  );
};

export default GenreManagementPage;
