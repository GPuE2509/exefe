import React from 'react';
import { Typography, Card, Divider } from 'antd';
import './PolicyPage.css';

const { Title, Paragraph, Text } = Typography;

const TermsOfServicePage = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <Card className="policy-card">
                    <Title level={1} className="policy-title">Terms of Service</Title>
                    <Text type="secondary">Last updated: January 2026</Text>
                    <Divider />

                    <Typography>
                        <Title level={3}>1. Agreement to Terms</Title>
                        <Paragraph>
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and EssGENIUS BOOKSTORE (“we,” “us” or “our”), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
                        </Paragraph>
                        <Paragraph>
                            You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                        </Paragraph>

                        <Title level={3}>2. Intellectual Property Rights</Title>
                        <Paragraph>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                        </Paragraph>

                        <Title level={3}>3. User Representations</Title>
                        <Paragraph>
                            By using the Site, you represent and warrant that:
                            <ul>
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You are not a minor in the jurisdiction in which you reside.</li>
                            </ul>
                        </Paragraph>

                        <Title level={3}>4. Prohibited Activities</Title>
                        <Paragraph>
                            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </Paragraph>

                        <Title level={3}>5. Contact Us</Title>
                        <Paragraph>
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                            <br />
                            <Text strong>EssGENIUS BOOKSTORE</Text>
                            <br />
                            123 Book Street, Dist 1, HCMC
                            <br />
                            Phone: 1900 0152
                            <br />
                            Email: support@essgenius.com
                        </Paragraph>
                    </Typography>
                </Card>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
