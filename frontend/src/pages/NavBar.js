import React from 'react'
import {
    UserOutlined,
    MessageOutlined,
    TransactionOutlined,
    CoffeeOutlined,
    SolutionOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import logo from '../img/LogoTitle.png'

const { Sider } = Layout

function NavBar({ setKey, collapsed }) {
    const navigate = useNavigate()
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
            default:
                navigate('/')
        }
    }

    return (
        <>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: '#ffdaab',
                }}
            >
                <div
                    className="logo"
                    style={{
                        display: 'flex',
                        justifyContent: 'Center',
                        height: 70,
                        margin: 10,
                    }}
                >
                    <img src={logo}></img>
                </div>
                <Menu
                    style={{
                        background: '#ffdaab',
                    }}
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={(e) => navigatePage(e.key)}
                    items={[
                        {
                            key: '1',
                            icon: <CoffeeOutlined />,
                            label: 'BuyMe',
                        },
                        {
                            key: '2',
                            icon: <SolutionOutlined />,
                            label: 'MyTasks',
                        },
                        {
                            key: '3',
                            icon: <MessageOutlined />,
                            label: 'Chat',
                        },
                        {
                            key: '4',
                            icon: <TransactionOutlined />,
                            label: 'Transfer',
                        },
                        {
                            key: '5',
                            icon: <UserOutlined />,
                            label: 'Account',
                        },
                    ]}
                />
            </Sider>
        </>
    )
}

export default NavBar
