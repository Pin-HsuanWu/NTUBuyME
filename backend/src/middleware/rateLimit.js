import rateLimit from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import Redis from 'ioredis'

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const createStore = (prefix) =>
    new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: `rl:${prefix}:`,
    })

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('auth'),
    message: { message: 'error', content: 'Too many attempts, please try again later' },
})

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('api'),
    message: { message: 'error', content: 'Too many requests, please slow down' },
})
