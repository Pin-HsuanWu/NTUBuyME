import React, { createContext, useContext, useState, useEffect } from 'react'
import { message } from 'antd'

const AppContext = createContext({
    status: {},
    me: '',
    signIn: false,
})

const c = new WebSocket('ws://localhost:8080')

const AppProvider = (props) => {
    const [messages, setMessages] = useState([])
    const [fulfill, setFulfill] = useState(false)
    useState('')
    const [status, setStatus] = useState([])
    const [reconnect, setReconnnect] = useState(false)
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

    useEffect(() => {
        displayStatus(status)
    }, [status])

    c.onmessage = (byteString) => {
        const { data } = byteString
        const [task, payload] = JSON.parse(data)
        switch (task) {
            case 'chat': {
                setChats(payload)
                break
            }

            case 'message': {
                setMessages([...messages, payload])
                break
            }

            case 'fulfill': {
                setFulfill(true)
            }
        }
    }

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
        c.send(JSON.stringify(data))
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
