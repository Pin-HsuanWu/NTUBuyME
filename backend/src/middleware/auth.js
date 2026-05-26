import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'ntubuyme-secret-key'

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
