import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '40px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <Result
          status="404"
          title="404"
          subTitle={
            <div>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Có thể trang đã bị xóa, di chuyển hoặc URL không đúng.
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
                Về trang chủ
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
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
            Gợi ý cho bạn:
          </h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>
            <li style={{ marginBottom: '4px' }}>• Kiểm tra lại đường dẫn URL</li>
            <li style={{ marginBottom: '4px' }}>• Sử dụng menu điều hướng</li>
            <li>• Liên hệ hỗ trợ nếu vấn đề tiếp tục</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;