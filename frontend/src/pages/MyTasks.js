import React from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownCircleOutlined,
} from '@ant-design/icons'
import { List, Space, Layout, Button, Tabs, Card, Divider } from 'antd'
import { useState, useEffect } from 'react'
import { instance } from '../api'
import { useApp } from '../UseApp'

const { Header, Content } = Layout

function MyTasks({ collapsed, setCollapsed }) {
    const [addedTasks, setAddedTasks] = useState([])
    const [acceptedTasks, setAcceptedTasks] = useState([])
    const [currentTab, setCurrentTab] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [nPerPage, setNPerPage] = useState(5)
    const [maxPageN, setMaxPageN] = useState(2)
    const [taskOverload, setTaskOverload] = useState(false)
    const { me, id } = useApp()

    useEffect(() => setCurrentTab('1'), [])
    useEffect(() => {
        if (currentTab === '1') {
            getMyAddedTasks(id, currentPage, nPerPage, maxPageN)
        } else {
            getMyAcceptedTasks(id, currentPage, nPerPage, maxPageN)
        }
    }, [currentTab])

    const getMyAddedTasks = async (id, currentPage, nPerPage, maxPageN) => {
        const {
            data: { myTasks, taskOverload },
        } = await instance.get('myAddedTasks', {
            params: {
                id,
                currentPage,
                nPerPage,
                maxPageN,
            },
        })
        setAddedTasks(displayTasks(myTasks))
        setTaskOverload(taskOverload)
    }

    const getMyAcceptedTasks = async (id, currentPage, nPerPage, maxPageN) => {
        const {
            data: { myTasks, taskOverload },
        } = await instance.get('myAcceptedTasks', {
            params: {
                id,
                currentPage,
                nPerPage,
                maxPageN,
            },
        })
        setAcceptedTasks(displayTasks(myTasks))
        setTaskOverload(taskOverload)
    }

    const displayTasks = (taskArray) => {
        return (
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        setCurrentPage(page)
                    },
                    pageSize: nPerPage,
                }}
                dataSource={taskArray}
                renderItem={(item) => (
                    <Card>
                        <DownCircleOutlined
                            style={{
                                fontSize: '15px',
                                color:
                                    item.status === 'accepted'
                                        ? '#b20000'
                                        : '#808080',
                            }}
                        />
                        <b style={{ fontSize: '15px' }}> {item.title}</b>
                        <Divider />
                        <Space
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                            }}
                        >
                            <Space>
                                <b>餐廳名稱: </b>
                                {item.restaurantName}
                            </Space>
                            <Space>
                                <b>任務內容: </b>
                                {item.taskContent}
                            </Space>
                            <Space>
                                <b>希望送達時間: </b>
                                {item.due_start.split('T')[0]}
                                {item.due_start.split('T')[1].slice(0, -5)}~
                                {item.due_end.split('T')[0]}
                                {item.due_end.split('T')[1].slice(0, -5)}
                            </Space>
                            <Space>
                                <b>外送費: </b>
                                {item.fee}
                            </Space>
                        </Space>
                        <Divider />
                    </Card>
                )}
            />
        )
    }

    const onChange = (key) => {
        setCurrentTab(key)
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
                <h1>MyTasks</h1>

                <Tabs
                    defaultActiveKey="1"
                    onChange={onChange}
                    items={[
                        {
                            label: `已新增任務`,
                            key: '1',
                            children: addedTasks,
                        },
                        {
                            label: `已接受任務`,
                            key: '2',
                            children: acceptedTasks,
                        },
                    ]}
                />
            </Content>
        </Layout>
    )
}
export default MyTasks
