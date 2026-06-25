import React from 'react'
import { instance } from '../api'
import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useApp } from '../UseApp'
import { Layout, Card, Input, Button, List } from 'antd'
import FulfillModal from '../containers/FulfillModal'
import Message from '../containers/Message'
import { useNavigate } from 'react-router-dom'
const { Header, Content } = Layout

const ChatBox = styled(Card)`
    width: 100%;
    height: 90%;
    background: #fcecca;
    border-radius: 50px;
    overflow: auto;
    margin-bottom: 10px;
    height: 'calc(500px - 36px)';
`

const ChatBoxWrapper = styled.div`
    position: fixed;
    top: 20%;
    left: 30%;
    transform: translate(-20%, 0);
    height: calc(500px - 36px);
    width: 500px;
    background: #ffdaab;
    opacity: 0.95;
    display: flex;
    flex-direction: column;
    overflow: auto;
    border-radius: 50px;
    padding: 25px;
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2)
    margin: -70% 0 0 -30%;
    `

const ChatRoomHeader = styled.div`
    width: 100%;
    height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    background: #fcecca;
    padding: 2px;
    margin-bottom: 10px;
`

const FootRef = styled.div`
    height: 10px;
    width: 100%;
`

function Chat({ collapsed, setCollapsed }) {
    const [msgSent, setMsgSent] = useState(false)
    const [chatOpen, setChatOpen] = useState(false)
    const [chatBoxName, setChatBoxName] = useState('')
    const [body, setBody] = useState('')
    const [title, setTitle] = useState('')
    const [senderID, setSenderID] = useState('')
    const [receiverID, setReceiverID] = useState('')
    const [taskID, setTaskID] = useState('')
    const [senderName, setSenderName] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [nPerPage, setNPerPage] = useState(5)
    const [maxPageN, setMaxPageN] = useState(10)
    const msgFooter = useRef(null)
    const navigate = useNavigate()
    const {
        id,
        me,
        setStatus,
        messages,
        setMessages,
        sendData,
        sendMessage,
        chats,
        setChats,
        fulfill,
        setFulfill,
        orderFulfillisInitializer,
        setKey,
    } = useApp()

    useEffect(() => {
        getChats(id)
    }, [])

    const OnChatRoom = async (chatRoom) => {
        setChatOpen(true)
        setMessages(chatRoom.messages)
        setChatBoxName(chatRoom.name)
        setTitle(chatRoom.title)
        setSenderID(chatRoom.sender)
        setReceiverID(chatRoom.receiver)
        setTaskID(chatRoom.task_id)
        setSenderName(chatRoom.from)
        await getChats(id)
        sendData(['CHAT', { name: chatRoom.name }])
    }

    const getChats = async (id) => {
        const {
            data: { chatRooms },
        } = await instance.get('getChat', { params: { id: id } })
        setChats(chatRooms)
    }

    const onFulfill = () => {
        sendData(['FULFILL', { id }])
    }

    const confirmFulfill = async () => {
        const {
            data: { chatRooms },
        } = await instance.post('fulfillOrder', {
            userID: id,
            senderID: senderID,
            receiverID: receiverID,
            taskID: taskID,
        })
        setChats(chatRooms)
        setKey('4')
        navigate('/transfer', { state: { receiverID: receiverID } })

        setFulfill(false)
        setChatOpen(false)
    }

    const askForPayMent = () => {
        setFulfill(false)
        setChatOpen(false)
    }

    const displayChat = (chat) => (
        <ChatBox>
            {chat.length === 0 ? (
                <p style={{ color: '#ccc' }}>No messages...</p>
            ) : (
                chat.map(({ sender, body }, i) => (
                    <Message
                        name={sender}
                        isMe={sender === me}
                        message={body}
                        key={i}
                    />
                ))
            )}
            <FootRef ref={msgFooter}></FootRef>
        </ChatBox>
    )

    const scrollToBottom = () => {
        msgFooter.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    }

    useEffect(() => {
        scrollToBottom()
        setMsgSent(false)
    }, [msgSent])

    return (
        <Layout className="site-layout">
            <Content
                className="site-layout-background"
                style={{
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
                {fulfill && (
                    <FulfillModal
                        fulfill={fulfill}
                        setFulfill={setFulfill}
                        confirmFulfill={confirmFulfill}
                        askForPayMent={askForPayMent}
                        setChatOpen={setChatOpen}
                        isSender={me === senderName}
                    />
                )}
                <div>
                    <h1>Chat</h1>
                    {chats.length !== 0 && (
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                onChange: (page) => {
                                    setCurrentPage(page)
                                },
                                pageSize: nPerPage,
                            }}
                            dataSource={chats}
                            renderItem={(element, key) => (
                                <Card
                                    title={element.title}
                                    style={{ margin: 20 }}
                                    key={key}
                                    hoverable="true"
                                    onClick={() => OnChatRoom(element)}
                                >
                                    <p>發起人： {element.from}</p>
                                    <p>期間： {new Date(element.due_start).toLocaleString()} ~ {new Date(element.due_end).toLocaleString()}</p>
                                    <p>費用: {element.fee}</p>
                                </Card>
                            )}
                            // chats.map((element, key) => (
                        />
                    )}
                </div>
                {chatOpen && (
                    // <div
                    //     style={{
                    //         display: 'flex',
                    //         width: '500px',
                    //         position: 'absolute',
                    //         zIndex: '15',
                    //         top: '50%',
                    //         left: '50%',
                    //         margin: '-15% 0 0 -10%',
                    //         filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
                    //     }}
                    // >
                    <ChatBoxWrapper>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                type="Dashed"
                                onClick={() => setChatOpen(false)}
                                style={{
                                    position: 'fixed',
                                    right: '25px',
                                    // top: '13px',
                                }}
                            >
                                X
                            </Button>
                            <ChatRoomHeader>
                                <p>{title}</p>
                            </ChatRoomHeader>
                        </div>

                        {displayChat(messages)}

                        <Input.Search
                            enterButton="Send"
                            placeholder="Type a message here..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            onSearch={(message) => {
                                if (!message) {
                                    setStatus({
                                        type: 'error',
                                        msg: 'Please enter a message body.',
                                    })
                                    return
                                }

                                sendMessage(me, body, chatBoxName)
                                setBody('')
                                setMsgSent(true)
                            }}
                        />
                        <Button
                            style={{ marginTop: '10px', borderRadius: '50px' }}
                            onClick={onFulfill}
                        >
                            完成訂單
                        </Button>
                    </ChatBoxWrapper>
                )}
            </Content>
        </Layout>
    )
}

export default Chat
