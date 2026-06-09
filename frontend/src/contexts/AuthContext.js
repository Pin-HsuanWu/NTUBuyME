import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LOCALSTORAGE_ID_KEY = 'save-id'
const LOCALSTORAGE_NAME_KEY = 'save-me'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [id, setId] = useState(() => localStorage.getItem(LOCALSTORAGE_ID_KEY) || '')
    const [me, setMe] = useState(() => localStorage.getItem(LOCALSTORAGE_NAME_KEY) || '')
    const [signIn, setSignIn] = useState(() => !!localStorage.getItem('token'))

    const login = useCallback(({ name, id: userId, token }) => {
        localStorage.setItem('token', token)
        localStorage.setItem(LOCALSTORAGE_ID_KEY, userId)
        localStorage.setItem(LOCALSTORAGE_NAME_KEY, name)
        setId(userId)
        setMe(name)
        setSignIn(true)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem(LOCALSTORAGE_ID_KEY)
        localStorage.removeItem(LOCALSTORAGE_NAME_KEY)
        setId('')
        setMe('')
        setSignIn(false)
    }, [])

    useEffect(() => {
        const handleForceLogout = () => logout()
        window.addEventListener('auth:logout', handleForceLogout)
        return () => window.removeEventListener('auth:logout', handleForceLogout)
    }, [logout])

    return (
        <AuthContext.Provider value={{ me, setMe, id, setId, signIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
