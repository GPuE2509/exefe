import React from 'react';
import { Modal, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LoadingModal = ({
  visible,
  message = 'Processing...',
  tip = 'Please wait a moment'
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40, color: '#1890ff' }} spin />;

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width={400}
      maskClosable={false}
      styles={{
        body: {
          textAlign: 'center',
          padding: '40px 20px',
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <Spin indicator={antIcon} size="large" />
        <div>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
            {message}
          </Text>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {tip}
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;