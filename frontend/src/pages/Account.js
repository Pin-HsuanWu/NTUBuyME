import React from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, List, Button, Space } from 'antd'
import { instance } from '../api'
import { useState, useEffect } from 'react'
import ChangePwdModal from '../containers/ChangePwdModal'
import EditAccModal from '../containers/EditAccModal'
const { Header, Content } = Layout

const Account = ({ collapsed, setCollapsed, me, id }) => {
    const [accountInfo, setAccountInfo] = useState('')
    const [ChangePwdModalOpen, setChangePwdModalOpen] = useState(false)
    const [EditAccModalOpen, setEditAccModalOpen] = useState(false)
    const [onClickItem, setOnClickItem] = useState('')

    useEffect(() => {
        console.log(me)
    }, [me])

    // Get Account
    useEffect(() => {
        getAccount(id)
    }, [])

    const getAccount = async (user_id) => {
        const { data: account } = await instance.get('/account', {
            params: {
                user_id,
            },
        })
        setAccountInfo(account.data)
    }

    // Edit Account
    const editAccount = async (user_id, item, newValue) => {
        const {
            data: { message, contents },
        } = await instance.post('/account', {
            user_id,
            item,
            newValue,
        })
        setAccountInfo(contents)
    }

    const changePassword = async (user_id, value) => {
        if (value.user.newpassword !== value.user.newpasswordcheck) {
            window.alert('Retype new password does not match new password!')
            return
        }

        const {
            data: { message, content },
        } = await instance.post('/changePassword', {
            user_id,
            currentPassword: value.user.currentpassword,
            newPassword: value.user.newpassword,
        })

        if (message === 'error') {
            window.alert(content)
        }
    }

    return (
        <Layout className="site-layout">
            <Content
                className="site-layout-background"
                style={{
                    // margin: '24px 16px',
                    padding: 24,
                    paddingTop: 50,
                    minHeight: 280,
                    borderRadius: 50,
                    marginTop: 50,
                    marginBottom: 50,
                    marginRight: '16%',
                    filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
                }}
            >
                <h1>Account</h1>
                <List size="large" bordered>
                    <List.Item>
                        <Space direction="column">
                            <b>學號: </b>
                            {accountInfo.user_id}
                        </Space>
                    </List.Item>

                    <List.Item>
                        <Space direction="column" align="center">
                            <b>姓名: </b>
                            {accountInfo.name}
                        </Space>
                        <Button
                            onClick={() => {
                                setEditAccModalOpen(true)
                                setOnClickItem('name')
                            }}
                        >
                            編輯
                        </Button>
                    </List.Item>

                    <List.Item
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                        }}
                    >
                        <Space
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                            }}
                        >
                            <b>銀行帳號</b>
                            <Space direction="column" align="center">
                                <b>銀行代碼: </b>
                                {Object(accountInfo.bankaccount).bank_id}
                            </Space>
                            <Space direction="column" align="center">
                                <b>戶頭帳號: </b>
                                {Object(accountInfo.bankaccount).bankaccount_id}
                            </Space>
                        </Space>

                        <Button
                            onClick={() => {
                                setEditAccModalOpen(true)
                                setOnClickItem('bankaccount')
                            }}
                        >
                            編輯
                        </Button>
                    </List.Item>

                    <List.Item>
                        <Button onClick={() => setChangePwdModalOpen(true)}>
                            更改密碼
                        </Button>
                    </List.Item>
                </List>
            </Content>
            <EditAccModal
                user={accountInfo}
                open={EditAccModalOpen}
                onCreate={(values) => {
                    editAccount(
                        id,
                        Object.keys(values.user),
                        Object.values(values.user)
                    )
                    setEditAccModalOpen(false)
                }}
                onCancel={() => setEditAccModalOpen(false)}
                item={onClickItem}
            />
            <ChangePwdModal
                user_id={id}
                open={ChangePwdModalOpen}
                onCreate={(value) => {
                    changePassword(id, value)
                    setChangePwdModalOpen(false)
                }}
                onCancel={() => setChangePwdModalOpen(false)}
            />
        </Layout>
    )
}
export default Account
