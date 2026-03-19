import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Upload,
    Space,
    Card,
    Row,
    Col,
    Typography,
    Tag,
    DatePicker,
    Popconfirm,
    message
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import LoadingModal from '../../components/LoadingModal';
import { adminBannerService } from '../../services/adminService';

const { Title } = Typography;
const { Option } = Select;

const BannerManagementPage = () => {
    // const { message } = App.useApp();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [form] = Form.useForm();

    // Fetch banners on mount
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await adminBannerService.getBanners();
            if (response.success) {
                setBanners(response.data?.banners || []);
            } else {
                message.error(response.message || 'Error fetching banners');
            }
        } catch (error) {
            message.error(error.message || 'Error fetching banners');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBanner(null);
        form.resetFields();
        // Set default values
        form.setFieldsValue({
            isActive: true,
            order: 0,
            position: 'homepage'
        });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingBanner(record);
        form.setFieldsValue({
            title: record.title,
            linkUrl: record.linkUrl,
            position: record.position,
            order: record.order,
            isActive: record.isActive,
            startAt: record.startAt ? dayjs(record.startAt) : null,
            endAt: record.endAt ? dayjs(record.endAt) : null,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            setDeleteLoading(true);
            const response = await adminBannerService.deleteBanner(id);
            if (response.success) {
                message.success('Banner deleted successfully');
                fetchBanners();
            } else {
                message.error(response.message || 'Error deleting banner');
            }
        } catch (error) {
            message.error(error.message || 'Error deleting banner');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setSubmitLoading(true);
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('linkUrl', values.linkUrl || '');
            formData.append('position', values.position);
            formData.append('order', values.order);
            formData.append('isActive', values.isActive);

            if (values.startAt) formData.append('startAt', values.startAt.toISOString());
            if (values.endAt) formData.append('endAt', values.endAt.toISOString());

            if (values.image && values.image.length > 0) {
                formData.append('image', values.image[0].originFileObj);
            }

            let response;
            if (editingBanner) {
                response = await adminBannerService.updateBanner(editingBanner._id, formData);
            } else {
                if (!values.image || values.image.length === 0) {
                    message.error('Please upload an image');
                    setSubmitLoading(false);
                    return;
                }
                response = await adminBannerService.createBanner(formData);
            }

            if (response.success) {
                message.success(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
                setModalVisible(false);
                fetchBanners();
            } else {
                message.error(response.message || 'Operation failed');
            }
        } catch (error) {
            message.error(error.message || 'Operation failed');
        } finally {
            setSubmitLoading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url) => <img src={url} alt="banner" style={{ width: 100, borderRadius: 4 }} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: (pos) => <Tag color="blue">{pos.toUpperCase()}</Tag>
        },
        {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
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
            title: 'Duration',
            key: 'duration',
            render: (_, record) => {
                if (!record.startAt && !record.endAt) return 'Always';
                const start = record.startAt ? dayjs(record.startAt).format('DD/MM/YYYY') : 'Start';
                const end = record.endAt ? dayjs(record.endAt).format('DD/MM/YYYY') : 'End';
                return `${start} - ${end}`;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this banner?"
                        description="Are you sure to delete this banner?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="banner-management">
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>Banner Management</Title>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Add Banner
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={banners}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingBanner ? "Edit Banner" : "Add Banner"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true, message: 'Please enter banner title' }]}
                            >
                                <Input placeholder="Enter title" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="order"
                                label="Order"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="position" label="Position" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="homepage">Homepage</Option>
                                    <Option value="category">Category</Option>
                                    <Option value="detail">Detail</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isActive" label="Status" valuePropName="checked">
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="linkUrl" label="Link URL">
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startAt" label="Start Date">
                                <DatePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="endAt" label="End Date">
                                <DatePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="image"
                        label="Banner Image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Recommended size: 1200x400px"
                    >
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            maxCount={1}
                            accept="image/*"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    {editingBanner && editingBanner.imageUrl && (
                        <div style={{ marginBottom: 16 }}>
                            <p>Current Image:</p>
                            <img src={editingBanner.imageUrl} alt="current" style={{ maxWidth: '100%', maxHeight: 150 }} />
                        </div>
                    )}

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>
                                {editingBanner ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <LoadingModal
                visible={submitLoading}
                message={editingBanner ? "Updating banner..." : "Creating banner..."}
            />
            <LoadingModal
                visible={deleteLoading}
                message="Deleting banner..."
            />
        </div>
    );
};

export default BannerManagementPage;
