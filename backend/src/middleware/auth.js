import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
}
const JWT_SECRET = process.env.JWT_SECRET

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })
}

export const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/refresh',
    })
}

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'error', content: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err) {
        return res.status(401).json({ message: 'error', content: 'Token expired' })
    }
}

export const refreshMiddleware = (req, res) => {
    const token = req.cookies?.refreshToken
    if (!token) {
        return res.status(401).json({ message: 'error', content: 'No refresh token' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ message: 'error', content: 'Invalid token type' })
        }
        const accessToken = generateAccessToken(decoded.userId)
        res.json({ message: 'success', content: { token: accessToken } })
    } catch (err) {
        res.clearCookie('refreshToken', { path: '/api/refresh' })
        return res.status(401).json({ message: 'error', content: 'Refresh token expired' })
    }
}
