import React, { useEffect } from 'react'
import {
    UserOutlined,
    MessageOutlined,
    TransactionOutlined,
    CoffeeOutlined,
    SolutionOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import logo from '../img/LogoTitle.png'
import { useApp } from '../UseApp'

const { Sider } = Layout

function NavBar({ collapsed }) {
    const navigate = useNavigate()
    const { key, setKey, setSignIn, setStatus, LOCALSTORAGE_STATUS, clickRef } =
        useApp()

    function navigatePage(key) {
        setKey(key)
        switch (key) {
            case '2':
                navigate('/mytasks')
                break
            case '3':
                navigate('/chat')
                break
            case '4':
                navigate('/transfer')
                break
            case '5':
                navigate('/account')
                break
            case '6':
                localStorage.removeItem('token')
                localStorage.setItem(LOCALSTORAGE_STATUS, 'logout')
                navigate('/login')
                setStatus({
                    type: 'success',
                    msg: 'Logout successfully!',
                })
                break
            default:
                navigate('/')
        }
    }

    return (
        <>
            <Sider
                width={250}
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    position: '-webkit-sticky',
                    position: 'sticky',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    marginLeft: '10%',
                    borderRadius: 20,
                    backgroundColor: '#f5f5f5',
                    marginRight: '2%',
                }}
            >
                <div
                    className="logo"
                    style={{
                        display: 'flex',
                        justifyContent: 'Center',
                        height: 100,
                        margin: 10,
                    }}
                >
                    <img src={logo}></img>
                </div>
                <Menu
                    className="tabBar"
                    style={{
                        background: '#f5f5f5',
                    }}
                    mode="inline"
                    selectedKeys={[key]}
                    onClick={(e) => navigatePage(e.key)}
                    items={[
                        {
                            key: '1',
                            icon: <CoffeeOutlined />,
                            label: 'BuyMe',
                            style: {
                                height: 50,
                                fontSize: 16,
                                borderRadius: 50,
                            },
                        },
                        {
                            key: '2',
                            icon: <SolutionOutlined />,
                            label: 'MyTasks',
                            style: {
                                height: 50,
                                fontSize: 16,
                                borderRadius: 50,
                            },
                        },
                        {
                            key: '3',
                            icon: <MessageOutlined />,
                            label: 'Chat',
                            style: {
                                height: 50,
                                fontSize: 16,
                                borderRadius: 50,
                            },
                        },
                        {
                            key: '4',
                            icon: <TransactionOutlined />,
                            label: 'Transfer',
                            style: {
                                height: 50,
                                fontSize: 16,
                                borderRadius: 50,
                            },
                        },
                        {
                            key: '5',
                            icon: <UserOutlined />,
                            label: 'Account',
                            style: {
                                height: 50,
                                fontSize: 16,
                                borderRadius: 50,
                            },
                        },
                        {
                            key: '6',
                            icon: <UserDeleteOutlined />,
                            label: 'Log Out',
                            style: {
                                height: 50,
                                fontSize: 16,
                                borderRadius: 50,
                            },
                        },
                    ]}
                ></Menu>
            </Sider>
        </>
    )
}

export default NavBar
