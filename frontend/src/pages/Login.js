import React, { useState, useEffect, useRef } from 'react'
import '../index.css'
import { useApp } from '../UseApp'
import { Button, Checkbox, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const bcrypt = require('bcryptjs')
const saltRounds = 10

const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
})

const Login = ({ setLogin, setRegister }) => {
    const { me, setMe, status, setStatus } = useApp()
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const navigateToMainPage = () => {
        navigate('/');
    }

<<<<<<< Updated upstream
    const navigateToRegister = () => {
        navigate('/register')
    }
=======
    useEffect(() => {
        if (id === "" || password === "") document.getElementById("submit").disabled = true
        else document.getElementById("submit").disabled = false
    }, [id, password])
>>>>>>> Stashed changes


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
                case 'error':
                    setStatus({
                        type: 'error',
                        msg: content,
                    })
                    alert(content)
                    break
                case 'success':
                    const result = bcrypt.compareSync(password, content)
                    if (result) {
                        navigateToMainPage()
                        setStatus({
                            type: 'success',
                            msg: 'Login successfully!',
                        })
<<<<<<< Updated upstream
=======
                        setCollapsed(false)
                        navigate('/')
>>>>>>> Stashed changes
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
        <div style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh"
        }}>
            <div className="loginFormContainer">
                <img src={require('../img/LogoTitle.png')} alt="Logo" style={{
                    width: "300px",
                    marginTop: "-100px",
                    marginBottom: "50px"
                }} />
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
                                setId(e.target.value)
                            }} />
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
                        <Input.Password
                            value={password}
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
<<<<<<< Updated upstream
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
=======
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}
                    >
                        <Button
                            id='submit'
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
        </div >
>>>>>>> Stashed changes
    )
}

export default Login
