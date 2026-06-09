import React, { useState } from 'react'
import '../index.css'
import { useAuth } from '../contexts/AuthContext'
import { Button, Checkbox, Form, Input, Layout, message as antMessage } from 'antd'
import { useNavigate } from 'react-router-dom'
import { instance } from '../api'

const { Content } = Layout

const Login = ({ setCollapsed }) => {
    const { id, setId, login } = useAuth()
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async () => {
        if (!id) {
            antMessage.error({ content: 'Missing student ID', duration: 1 })
            return
        }
        if (!password) {
            antMessage.error({ content: 'Missing password', duration: 1 })
            return
        }

        try {
            const { data: { message, content } } = await instance.post('/login', {
                userId: id,
                password: password,
            })

            if (message === 'success') {
                login(content)
                setCollapsed(false)
                navigate('/')
                antMessage.success({ content: 'Login successfully!', duration: 1 })
            } else {
                antMessage.error({ content: content, duration: 1 })
            }
        } catch (err) {
            const msg = err.response?.data?.content || 'Login failed'
            antMessage.error({ content: msg, duration: 1 })
        }
    }

    return (
        // <div
        //     style={{
        //         display: 'flex',
        //         justifyContent: 'center',
        //         height: '100vh',
        //     }}
        // >
        <Content
            className="site-layout-background"
            style={{
                padding: 100,
                height: '100vh',
                display: 'flex',

                // filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
            }}
        >
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
                <h1
                    className="title"
                    style={{ marginBottom: 30, fontSize: 30 }}
                >
                    Welcome to NTU BuyMe!
                </h1>
                <Form
                    name="basic"
                    className="loginForm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Student ID"
                        name="Student ID"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your student ID!',
                            },
                        ]}
                    >
                        <Input
                            value={id}
                            id="userID"
                            onChange={(e) => {
                                setId(e.target.value.toUpperCase())
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input
                            value={password}
                            type="password"
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                        <Button
                            id="submit"
                            type="primary"
                            htmlType="submit"
                            style={{
                                margin: 5,
                                width: 80,
                            }}
                            onClick={handleLogin}
                        >
                            Submit
                        </Button>
                        <Button
                            type="default"
                            style={{
                                margin: 5,
                                width: 80,
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Content>
        // </div>
    )
}

export default Login
