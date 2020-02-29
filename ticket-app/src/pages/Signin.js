import React from 'react';
import { useHistory } from "react-router-dom";
import LoginLayout from '../components/LoginLayout';
import { Form, Radio, Input, Button } from 'antd';
import './Login.css';
import { signin } from '../services/Api';

const NormalSigninFormContainer:React.FC = () => {
  const {push} = useHistory();
  function handleRedirect () {
    push('/login');
  }
  return <WrappedNormalSigninForm onRedirect={handleRedirect} />
}

class NormalSigninForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        await signin(values);
        this.props.onRedirect();
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 10,
        },
      },
    };
    return (
      <LoginLayout>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator('nombre', {
              rules: [{ required: true, message: 'Please input your name!' }],
            })(<Input placeholder="Name" />,)}
          </Form.Item>
          <Form.Item label="E-mail">
            {getFieldDecorator('mail', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirmed_password', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item label="Type">
            {getFieldDecorator('id_tipousuario')(
              <Radio.Group>
                <Radio value="1">Administrador</Radio>
                <Radio value="2">Usuario</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </LoginLayout>
    );
  }
}

const WrappedNormalSigninForm = Form.create({ name: 'normal_login' })(NormalSigninForm);

export default NormalSigninFormContainer;