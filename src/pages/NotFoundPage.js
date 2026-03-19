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
                Sorry, the page you are looking for does not exist.
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                The page may have been deleted, moved, or the URL is incorrect.
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
                Back to Home
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                size="large"
              >
                Go Back
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
            Suggestions for you:
          </h4>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>
            <li style={{ marginBottom: '4px' }}>• Check the URL</li>
            <li style={{ marginBottom: '4px' }}>• Use the navigation menu</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;