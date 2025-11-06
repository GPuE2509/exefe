import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authService } from '../services/authService';
import './LoginPage.css';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.login({
        email: values.username,
        password: values.password
      });

      if (result.success) {
        // Lấy URL trước đó hoặc redirect mặc định
        const from = location.state?.from?.pathname || '/';
        
        // Nếu user là admin, redirect đến admin dashboard
        if (authService.isAdmin()) {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <section className="login-section">
          <Card className="login-container">
            <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
              ĐĂNG NHẬP
            </Title>
            
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
            >
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
              )}
              
              <Form.Item
                name="username"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  disabled={loading}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a href="#" className="forgot-password">Quên mật khẩu?</a>
            </div>
            
            <div className="register-link">
              <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
