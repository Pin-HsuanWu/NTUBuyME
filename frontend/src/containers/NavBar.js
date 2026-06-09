import React, { useState } from 'react'
import {
    UserOutlined,
    MessageOutlined,
    TransactionOutlined,
    CoffeeOutlined,
    SolutionOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons'
import { Layout, Menu, message as antMessage } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../img/LogoTitle.png'
import { useAuth } from '../contexts/AuthContext'

const { Sider } = Layout

const pathToKey = { '/': '1', '/mytasks': '2', '/chat': '3', '/transfer': '4', '/account': '5' }
const keyToPath = { '1': '/', '2': '/mytasks', '3': '/chat', '4': '/transfer', '5': '/account' }

function NavBar({ collapsed }) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { logout } = useAuth()

    const selectedKey = pathToKey[pathname] || '1'

    function navigatePage(key) {
        if (key === '6') {
            logout()
            navigate('/login')
            antMessage.success({ content: 'Logout successfully!', duration: 1 })
            return
        }
        navigate(keyToPath[key] || '/')
    }

    return (
        <Sider
            width={250}
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                overflow: 'auto',
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
                <img src={logo} alt="NTUBuyMe" />
            </div>
            <Menu
                className="tabBar"
                style={{ background: '#f5f5f5' }}
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={(e) => navigatePage(e.key)}
                items={[
                    { key: '1', icon: <CoffeeOutlined />, label: 'BuyMe', style: { height: 50, fontSize: 16, borderRadius: 50 } },
                    { key: '2', icon: <SolutionOutlined />, label: 'MyTasks', style: { height: 50, fontSize: 16, borderRadius: 50 } },
                    { key: '3', icon: <MessageOutlined />, label: 'Chat', style: { height: 50, fontSize: 16, borderRadius: 50 } },
                    { key: '4', icon: <TransactionOutlined />, label: 'Transfer', style: { height: 50, fontSize: 16, borderRadius: 50 } },
                    { key: '5', icon: <UserOutlined />, label: 'Account', style: { height: 50, fontSize: 16, borderRadius: 50 } },
                    { key: '6', icon: <UserDeleteOutlined />, label: 'Log Out', style: { height: 50, fontSize: 16, borderRadius: 50 } },
                ]}
            />
        </Sider>
    )
}

export default NavBar
