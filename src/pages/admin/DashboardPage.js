import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Typography, Spin, message } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AudioOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { adminStatisticsService } from '../../services/adminService';

const { Title } = Typography;

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBooks: [],
    topGenres: [],
    userGrowth: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, booksData, genresData, usersData] = await Promise.all([
        adminStatisticsService.getDashboardStats(),
        adminStatisticsService.getBookStats(),
        adminStatisticsService.getUserStats(),
        adminStatisticsService.getOrderStats()
      ]);

      // Check if all responses are successful
      const allSuccessful = [statsData, booksData, genresData, usersData].every(response => response.success);

      if (allSuccessful) {
        setDashboardData({
          stats: statsData.data || {},
          recentBooks: booksData.data?.recentBooks || [],
          topGenres: genresData.data?.topGenres || [],
          userGrowth: usersData.data?.userGrowth || []
        });
      } else {
        // Find first failed response and show its message
        const failedResponse = [statsData, booksData, genresData, usersData].find(response => !response.success);
        if (failedResponse) {
          message.error(failedResponse.message || 'Error fetching dashboard data');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error fetching dashboard data';
      message.error(errorMessage);
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Books',
      value: dashboardData.stats.totalBooks || 0,
      icon: <BookOutlined />,
      color: '#1890ff',
      trend: '+12%'
    },
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers || 0,
      icon: <UserOutlined />,
      color: '#52c41a',
      trend: '+8%'
    },
    {
      title: 'Orders',
      value: dashboardData.stats.totalOrders || 0,
      icon: <ShoppingCartOutlined />,
      color: '#fa8c16',
      trend: '+15%'
    },
    {
      title: 'Book Audios',
      value: dashboardData.stats.totalAudios || 0,
      icon: <AudioOutlined />,
      color: '#722ed1',
      trend: '+20%'
    }
  ];

  const recentBooksColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'authors',
      key: 'authors',
      render: (authors) => authors?.join(', ') || '-'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price?.toLocaleString()} VNĐ`
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US')
    }
  ];

  const topGenresColumns = [
    {
      title: 'Genre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Book Count',
      dataIndex: 'bookCount',
      key: 'bookCount',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => (
        <Progress percent={percentage} size="small" />
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading data...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
                suffix={
                  <span style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> {stat.trend}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Books */}
        <Col xs={24} lg={14}>
          <Card title="Recent Books" extra={<a href="/admin/books">View All</a>}>
            <Table
              columns={recentBooksColumns}
              dataSource={dashboardData.recentBooks || []}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Top Genres */}
        <Col xs={24} lg={10}>
          <Card title="Popular Genres">
            <Table
              columns={topGenresColumns}
              dataSource={dashboardData.topGenres || []}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* User Growth Chart */}
        <Col xs={24} lg={12}>
          <Card title="User Growth">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ color: '#1890ff' }}>
                  +{dashboardData.stats.newUsersThisMonth || 0}
                </Title>
                <p>New users this month</p>
              </div>
            </div>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Card size="small" hoverable style={{ textAlign: 'center' }}>
                  <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <div style={{ marginTop: '8px' }}>Add Book</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" hoverable style={{ textAlign: 'center' }}>
                  <AudioOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <div style={{ marginTop: '8px' }}>Add Audio</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" hoverable style={{ textAlign: 'center' }}>
                  <UserOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                  <div style={{ marginTop: '8px' }}>Manage Users</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" hoverable style={{ textAlign: 'center' }}>
                  <ShoppingCartOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                  <div style={{ marginTop: '8px' }}>Orders</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
