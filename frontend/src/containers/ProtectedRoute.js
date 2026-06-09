import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { signIn } = useAuth()
    if (!signIn) return <Navigate to="/login" replace />
    return children
}

export default ProtectedRoute
