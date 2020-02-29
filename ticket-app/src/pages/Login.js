import React from 'react';
import { useHistory } from "react-router-dom";
import LoginLayout from '../components/LoginLayout';
import { Form, Icon, Input, Button } from 'antd';
import './Login.css';
import { auth, validate } from '../services/Api';

const NormalLoginFormContainer:React.FC = () => {
  const {push} = useHistory();
  function handleRedirect () {
    push('/tickets');
  }
  return <WrappedNormalLoginForm onRedirect={handleRedirect} />
}

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        const {data:token} = await auth(values);
        if (token) {
          const {data:{tipo}} = await validate(token); 
          localStorage.setItem('token', token);
          localStorage.setItem('tipo', tipo);
          this.props.onRedirect();
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <LoginLayout>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('mail', {
              rules: [{ rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ], }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="/signin">register now!</a>
          </Form.Item>
        </Form>
      </LoginLayout>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default NormalLoginFormContainer;