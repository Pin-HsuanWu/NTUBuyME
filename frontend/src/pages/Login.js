import React, { useState, useEffect, useRef } from 'react'
import '../index.css'
import { useApp } from '../UseApp'
import { Button, Checkbox, Form, Input, Layout } from 'antd'
import { useNavigate } from 'react-router-dom'
import { instance } from '../api'

const bcrypt = require('bcryptjs')
const { Header, Content } = Layout

const Login = ({ setLogin, setCollapsed }) => {
    const {
        me,
        setMe,
        status,
        setStatus,
        setSignIn,
        id,
        setId,
        LOCALSTORAGE_ID_KEY,
        LOCALSTORAGE_NAME_KEY,
        LOCALSTORAGE_STATUS,
    } = useApp()
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    // useEffect(() => {
    //     if (id === '' || password === '')
    //         document.getElementById('submit').disabled = true
    //     else document.getElementById('submit').disabled = false
    // }, [id, password])

    const handleLogin = async () => {
        if (!id) {
            setStatus({
                type: 'error',
                msg: 'Missing student ID',
            })
        } else if (!password) {
            setStatus({
                type: 'error',
                msg: 'Missing password',
            })
            alert('Missing password')
        } else {
            const {
                data: { message, content },
            } = await instance.post('/login', {
                userId: id,
            })

            switch (message) {
                default:
                    break
                case 'error':
                    setStatus({
                        type: 'error',
                        msg: content,
                    })
                    alert(content)
                    break
                case 'success':
                    const result = bcrypt.compareSync(
                        password,
                        content.password
                    )
                    if (result) {
                        setMe(content.name)
                        setLogin(true)
                        setSignIn(true)
                        localStorage.setItem(LOCALSTORAGE_ID_KEY, id)
                        localStorage.setItem(
                            LOCALSTORAGE_NAME_KEY,
                            content.name
                        )
                        localStorage.setItem(LOCALSTORAGE_STATUS, 'login')
                        setStatus({
                            type: 'success',
                            msg: 'Login successfully!',
                        })
                        setCollapsed(false)
                        navigate('/')
                    } else {
                        setStatus({
                            type: 'error',
                            msg: 'Wrong password!',
                        })
                    }
                    break
            }
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
