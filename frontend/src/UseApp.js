import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { useAuth } from './contexts/AuthContext'
import { useChat } from './contexts/ChatContext'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'

const AppProvider = ({ children }) => (
    <AuthProvider>
        <ChatProvider>
            {children}
        </ChatProvider>
    </AuthProvider>
)

const useApp = () => {
    const { me, setMe, id, setId, signIn, login, logout } = useAuth()
    const { messages, setMessages, chats, setChats, fulfill, setFulfill, sendData, sendMessage } = useChat()
    const [status, setStatus] = useState({})
    const [key, setKey] = useState('1')

    useEffect(() => {
        if (status.msg) {
            const config = { content: status.msg, duration: 1 }
            if (status.type === 'success') {
                message.success(config)
            } else {
                message.error(config)
            }
        }
    }, [status])

    return {
        me,
        setMe,
        id,
        setId,
        signIn,
        setSignIn: () => {},
        login,
        logout,
        status,
        setStatus,
        messages,
        setMessages,
        chats,
        setChats,
        fulfill,
        setFulfill,
        sendData,
        sendMessage,
        key,
        setKey,
        LOCALSTORAGE_ID_KEY: 'save-id',
        LOCALSTORAGE_NAME_KEY: 'save-me',
        LOCALSTORAGE_STATUS: 'status',
    }
}

export { AppProvider, useApp, useAuth, useChat }
