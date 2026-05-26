import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
}
const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
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
        return res.status(401).json({ message: 'error', content: 'Invalid token' })
    }
}
