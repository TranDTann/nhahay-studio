'use client'
import { Typography } from 'antd';

const { Title } = Typography;

export default function AdminHomePage() {
  return (
    <div>
      <Title level={2}>Welcome to Admin Dashboard</Title>
      <p>This is the main administration area where you can manage your website content.</p>
    </div>
  );
}
