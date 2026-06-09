import React, { useState } from 'react'
import './index.css'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Transfer from './pages/Transfer'
import Account from './pages/Account'
import MainPage from './pages/MainPage'
import Register from './pages/Register'
import NavBar from './containers/NavBar'
import ProtectedRoute from './containers/ProtectedRoute'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import MyTasks from './pages/MyTasks'
import { useApp } from './UseApp'
import { Layout } from 'antd'

function App() {
    const [collapsed, setCollapsed] = useState(false)
    const { pathname } = useLocation()
    const { me, id, signIn } = useApp()

    return (
        <Layout>
            {pathname !== '/login' && pathname !== '/register' && (
                <NavBar collapsed={collapsed} />
            )}
            <Routes>
                <Route path="/login" element={
                    signIn ? <Navigate to="/" replace /> : <Login setCollapsed={setCollapsed} />
                } />
                <Route path="/register" element={
                    signIn ? <Navigate to="/" replace /> : <Register />
                } />
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainPage collapsed={collapsed} setCollapsed={setCollapsed} me={me} />
                    </ProtectedRoute>
                } />
                <Route path="/mytasks" element={
                    <ProtectedRoute>
                        <MyTasks collapsed={collapsed} setCollapsed={setCollapsed} />
                    </ProtectedRoute>
                } />
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <Chat collapsed={collapsed} setCollapsed={setCollapsed} />
                    </ProtectedRoute>
                } />
                <Route path="/transfer" element={
                    <ProtectedRoute>
                        <Transfer collapsed={collapsed} setCollapsed={setCollapsed} />
                    </ProtectedRoute>
                } />
                <Route path="/account" element={
                    <ProtectedRoute>
                        <Account collapsed={collapsed} setCollapsed={setCollapsed} me={me} id={id} />
                    </ProtectedRoute>
                } />
            </Routes>
        </Layout>
    )
}

export default App
