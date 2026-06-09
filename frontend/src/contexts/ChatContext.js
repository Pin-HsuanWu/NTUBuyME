import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from './AuthContext'

const WS_URL = process.env.REACT_APP_WS_URL || `wss://${window.location.host}/ws`

const ChatContext = createContext(null)

export const ChatProvider = ({ children }) => {
    const { signIn, logout } = useAuth()
    const [messages, setMessages] = useState([])
    const [chats, setChats] = useState([])
    const [fulfill, setFulfill] = useState(false)

    const wsRef = useRef(null)
    const reconnectTimeout = useRef(null)
    const backoff = useRef(1000)

    const connectWs = useCallback(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () => {
            backoff.current = 1000
        }

        ws.onmessage = (byteString) => {
            const { data } = byteString
            const [task, payload] = JSON.parse(data)
            switch (task) {
                case 'chat':
                    setChats(payload)
                    break
                case 'message':
                    setMessages((prev) => [...prev, payload])
                    break
                case 'fulfill':
                    setFulfill(true)
                    break
            }
        }

        ws.onclose = (e) => {
            if (e.code === 4001) {
                logout()
                return
            }
            reconnectTimeout.current = setTimeout(() => {
                backoff.current = Math.min(backoff.current * 2, 30000)
                connectWs()
            }, backoff.current)
        }

        wsRef.current = ws
    }, [logout])

    useEffect(() => {
        if (signIn) {
            connectWs()
        }
        return () => {
            clearTimeout(reconnectTimeout.current)
            if (wsRef.current) wsRef.current.close()
        }
    }, [signIn, connectWs])

    const sendData = useCallback((data) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data))
        }
    }, [])

    const sendMessage = useCallback((me, body, chatBoxName) => {
        sendData(['MESSAGE', { who: me, body, name: chatBoxName }])
    }, [sendData])

    return (
        <ChatContext.Provider value={{ messages, setMessages, chats, setChats, fulfill, setFulfill, sendData, sendMessage }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) throw new Error('useChat must be used within ChatProvider')
    return context
}
