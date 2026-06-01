import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey() {
    const key = process.env.ENCRYPTION_KEY
    if (!key || Buffer.from(key, 'hex').length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
    }
    return Buffer.from(key, 'hex')
}

export function encrypt(text) {
    if (!text) return text
    const iv = randomBytes(12)
    const cipher = createCipheriv(ALGORITHM, getKey(), iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const tag = cipher.getAuthTag().toString('hex')
    return `${iv.toString('hex')}:${tag}:${encrypted}`
}

export function decrypt(data) {
    if (!data || !data.includes(':')) return data
    const [ivHex, tagHex, encrypted] = data.split(':')
    const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
