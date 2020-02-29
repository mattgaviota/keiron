import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

function LoginLayout(props) {
  const {children} = props; 
  return (
    <Layout className="layout">
      <Content style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default LoginLayout;