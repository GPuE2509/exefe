import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const AdminNotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/admin');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ 
      padding: '40px',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Result
        status="404"
        title="404"
        subTitle={
          <div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              Trang quản trị bạn đang tìm kiếm không tồn tại.
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Vui lòng kiểm tra lại đường dẫn hoặc sử dụng menu điều hướng.
            </p>
          </div>
        }
        extra={
          <div style={{ marginTop: '20px' }}>
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              size="large"
              style={{ marginRight: '12px' }}
            >
              Về trang chủ Admin
            </Button>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              size="large"
            >
              Quay lại
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default AdminNotFoundPage;