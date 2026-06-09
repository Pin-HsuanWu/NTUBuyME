import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { message } from 'antd'

const AppContext = createContext({
    status: {},
    me: '',
    signIn: false,
})

const WS_URL = process.env.REACT_APP_WS_URL || `wss://${window.location.host}/ws`

const AppProvider = (props) => {
    const [messages, setMessages] = useState([])
    const [fulfill, setFulfill] = useState(false)
    const [status, setStatus] = useState([])
    const [signIn, setSignIn] = useState(false)
    const [chats, setChats] = useState([])
    const LOCALSTORAGE_ID_KEY = 'save-id'
    const LOCALSTORAGE_NAME_KEY = 'save-me'
    const LOCALSTORAGE_STATUS = 'status'
    const savedId = localStorage.getItem(LOCALSTORAGE_ID_KEY)
    const savedMe = localStorage.getItem(LOCALSTORAGE_NAME_KEY)
    const [id, setId] = useState(savedId || '')
    const [me, setMe] = useState(savedMe || '')
    const [key, setKey] = useState('1')

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
                case 'chat': {
                    setChats(payload)
                    break
                }
                case 'message': {
                    setMessages((prev) => [...prev, payload])
                    break
                }
                case 'fulfill': {
                    setFulfill(true)
                    break
                }
            }
        }

        ws.onclose = () => {
            reconnectTimeout.current = setTimeout(() => {
                backoff.current = Math.min(backoff.current * 2, 30000)
                connectWs()
            }, backoff.current)
        }

        wsRef.current = ws
    }, [])

    useEffect(() => {
        connectWs()
        return () => {
            clearTimeout(reconnectTimeout.current)
            if (wsRef.current) wsRef.current.close()
        }
    }, [connectWs])

    useEffect(() => {
        displayStatus(status)
    }, [status])

    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg } = s
            const status = {
                content: msg,
                duration: 1,
            }
            switch (type) {
                case 'success':
                    message.success(status)
                    break
                case 'error':
                default:
                    message.error(status)
                    break
            }
        }
    }

    const sendData = (data) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data))
        }
    }

    const sendMessage = (me, body, chatBoxName) => {
        sendData(['MESSAGE', { who: me, body: body, name: chatBoxName }])
    }

    return (
        <AppContext.Provider
            value={{
                me,
                setMe,
                id,
                setId,
                signIn,
                setSignIn,
                status,
                setStatus,
                messages,
                setMessages,
                LOCALSTORAGE_ID_KEY,
                LOCALSTORAGE_NAME_KEY,
                LOCALSTORAGE_STATUS,
                sendData,
                sendMessage,
                chats,
                setChats,
                fulfill,
                setFulfill,
                key,
                setKey,
            }}
            {...props}
        />
    )
}

const useApp = () => useContext(AppContext)
export { AppProvider, useApp }
