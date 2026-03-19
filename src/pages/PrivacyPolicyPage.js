import React from 'react';
import { Typography, Card, Divider } from 'antd';
import './PolicyPage.css';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicyPage = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <Card className="policy-card">
                    <Title level={1} className="policy-title">Privacy Policy</Title>
                    <Text type="secondary">Last updated: January 2026</Text>
                    <Divider />

                    <Typography>
                        <Title level={3}>1. Introduction</Title>
                        <Paragraph>
                            Welcome to EssGENIUS BOOKSTORE. We are committed to protecting your personal information and your right to privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                        </Paragraph>

                        <Title level={3}>2. Information We Collect</Title>
                        <Paragraph>
                            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
                        </Paragraph>
                        <Paragraph>
                            The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:
                            <ul>
                                <li>Name and Contact Data (Email address, phone number, etc.)</li>
                                <li>Credentials (Passwords, hints, etc.)</li>
                                <li>Payment Data (Credit card numbers, etc. if applicable)</li>
                            </ul>
                        </Paragraph>

                        <Title level={3}>3. How We Use Your Information</Title>
                        <Paragraph>
                            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                            <ul>
                                <li>To facilitate account creation and logon process.</li>
                                <li>To send you marketing and promotional communications.</li>
                                <li>To fulfill and manage your orders.</li>
                                <li>To protect our Services.</li>
                            </ul>
                        </Paragraph>

                        <Title level={3}>4. Sharing Your Information</Title>
                        <Paragraph>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </Paragraph>

                        <Title level={3}>5. Contact Us</Title>
                        <Paragraph>
                            If you have questions or comments about this policy, you may email us at <Text strong>support@essgenius.com</Text> or by post to:
                            <br />
                            <Text strong>EssGENIUS BOOKSTORE</Text>
                            <br />
                            123 Book Street, Dist 1, HCMC
                        </Paragraph>
                    </Typography>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
