import React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { isAuth, logout } from '../utils';

const { Header, Content } = Layout;


function MainLayout(props) {
  const { children } = props;
  const { push } = useHistory();
  return (
    <Layout className="layout">
      <Header style={{ background: '#f0f2f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Tickets</h1>
          {isAuth && <Button onClick={() => { logout(); push('/'); }}>Logout</Button>}
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        {children}
      </Content>
    </Layout>
  );
}

export default MainLayout;
