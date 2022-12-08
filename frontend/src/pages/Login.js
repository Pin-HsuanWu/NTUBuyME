import React from 'react';
import '../index.css';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Login({ login, setLogin }) {
    const navigate = useNavigate();

    const navigateToMainPage = () => {
        navigate('/');
    }

    const navigateToRegister = () => {
        navigate('/register')
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='loginFormContainer'>
            <Form
                name="basic"
                className='loginForm'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onSubmitCapture={() => { navigateToMainPage() }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" style={{
                        margin: 5,
                        width: 80
                    }}>
                        Submit
                    </Button>
                    <Button type="default" htmlType="submit" style={{
                        margin: 5,
                        width: 80
                    }}
                        onClick={navigateToRegister}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login