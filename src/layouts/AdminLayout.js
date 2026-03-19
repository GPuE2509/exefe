import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  AudioOutlined,
  PictureOutlined,
  TagsOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarsOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Menu items
  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/books',
      icon: <BookOutlined />,
      label: 'Book Management',
    },
    {
      key: '/admin/audios',
      icon: <AudioOutlined />,
      label: 'Audio Management',
    },
    {
      key: '/admin/images',
      icon: <PictureOutlined />,
      label: 'Image Management',
    },
    {
      key: '/admin/genres',
      icon: <TagsOutlined />,
      label: 'Genre Management',
    },
    {
      key: '/admin/banners',
      icon: <PictureOutlined />,
      label: 'Banner Management',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setMobileMenuVisible(false);
    }
  };

  const toggleMobileMenu = () => {
    if (isMobile) {
      setMobileMenuVisible(!mobileMenuVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/admin/profile');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const sidebarContent = (
    <>
      <div className="admin-logo">
        <BarsOutlined style={{ fontSize: '24px', color: '#fff' }} />
        {(!collapsed || isMobile) && <span>Admin Panel</span>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="dark"
          width={250}
          className="desktop-sidebar"
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          bodyStyle={{ padding: 0, backgroundColor: '#001529' }}
          headerStyle={{ backgroundColor: '#001529', borderBottom: '1px solid #303030' }}
          width={250}
          className="mobile-drawer"
        >
          {sidebarContent}
        </Drawer>
      )}

      <Layout className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
        <Header
          className="admin-header"
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: isMobile ? '12px' : '24px',
          }}
        >
          <div className="header-left">
            <Button
              type="text"
              icon={isMobile ? <BarsOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={toggleMobileMenu}
              className="menu-toggle"
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <h2 className="header-title">
              {isMobile ? 'Admin' : 'Book Management System'}
            </h2>
          </div>

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div className="user-info">
              <Avatar
                size={isMobile ? 'default' : 'large'}
                icon={<UserOutlined />}
                style={{ marginRight: isMobile ? '4px' : '8px' }}
              />
              {!isMobile && <span>{authService.getCurrentUser()?.fullName || 'Admin User'}</span>}
            </div>
          </Dropdown>
        </Header>

        <Content
          className="admin-content"
          style={{
            margin: isMobile ? '12px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
