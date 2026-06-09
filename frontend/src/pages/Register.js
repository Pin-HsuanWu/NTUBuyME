import React from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Form, Input, Select, Layout, Divider, message as antMessage } from 'antd'
import { useNavigate } from 'react-router-dom'
import { instance } from '../api'

const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 16,
    },
}

const { Content } = Layout


const Register = () => {
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const [form] = Form.useForm()

    const navigate = useNavigate()

    const onFinish = async (value) => {
        value.user.id = value.user.id.toUpperCase()

        try {
            const { data: { message, content } } = await instance.post('/register', value)

            if (message === 'success') {
                login(content)
                antMessage.success({ content: 'Account created!', duration: 1 })
                navigate('/')
            } else {
                antMessage.error({ content: content, duration: 1 })
            }
        } catch (err) {
            const msg = err.response?.data?.content || 'Registration failed'
            antMessage.error({ content: msg, duration: 1 })
        }
        form.resetFields()
    }
    return (
        <Content
            className="site-layout-background"
            style={{
                padding: 100,
                height: '100vh',
                display: 'flex',

                // filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
            }}
        >
            {' '}
            <div
                style={{
                    display: 'flex',
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fbf7e2',
                    borderTopLeftRadius: 50,
                    borderBottomLeftRadius: 50,
                    filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
                }}
            >
                <img
                    src={require('../img/logo_animation.gif')}
                    alt="Logo"
                    style={{
                        width: '100%',
                        marginTop: '-100px',
                        // marginBottom: '50px',
                    }}
                />
            </div>
            <div
                className="loginFormContainer"
                style={{
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                    filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
                }}
            >
                <Form
                    {...layout}
                    name="nest-messages"
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="Personal info"
                        style={{ marginLeft: '-20%', fontWeight: 'bold' }}
                    />
                    <Form.Item
                        name={['user', 'name']}
                        label="Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'id']}
                        label="Id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'password']}
                        label="Password"
                        rules={[
                            {
                                type: 'password',
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Divider />
                    <Form.Item
                        label="Bank account"
                        style={{ marginLeft: '-20%', fontWeight: 'bold' }}
                    />
                    <Form.Item
                        name={['user', 'bank_id']}
                        label="Bank id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            style={{
                                width: 155,
                            }}
                            options={[
                                {
                                    value: '812',
                                    label: '812 台新銀行',
                                },
                                {
                                    value: '822',
                                    label: '822 中國信託',
                                },
                                {
                                    value: '007',
                                    label: '007 第一銀行',
                                },
                                {
                                    value: '012',
                                    label: '012 台北富邦',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name={['user', 'bankaccount_id']}
                        label="Bank account id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                margin: 5,
                                width: 80,
                            }}
                        >
                            Submit
                        </Button>
                        <Button
                            type="default"
                            style={{
                                margin: 5,
                                width: 80,
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Content>
    )
}

export default Register
