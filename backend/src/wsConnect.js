import { ChatBoxModel, MessageModel } from './models/BuyMe'
import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const pub = new Redis(redisUrl)
const sub = new Redis(redisUrl)

const localClients = new Map()

const sendData = (data, ws) => {
    if (ws.readyState === 1) {
        ws.send(JSON.stringify(data))
    }
}

const broadcastToRoom = (room, data) => {
    pub.publish('chat:broadcast', JSON.stringify({ room, data }))
}

sub.subscribe('chat:broadcast')
sub.on('message', (channel, message) => {
    if (channel !== 'chat:broadcast') return
    const { room, data } = JSON.parse(message)
    localClients.forEach((ws) => {
        if (ws.box === room) {
            sendData(data, ws)
        }
    })
})

export default {
    registerClient: (ws) => {
        localClients.set(ws.id, ws)
    },

    unregisterClient: (ws) => {
        localClients.delete(ws.id)
        pub.srem(`room:${ws.box}`, ws.id)
    },

    onMessage: (wss, ws) => async (byteString) => {
        const { data } = byteString
        const [task, payload] = JSON.parse(data)
        switch (task) {
            case 'MESSAGE': {
                const { who, body, name } = payload
                ws.box = name
                const message = new MessageModel({ sender: who, body: body })
                try {
                    await message.save()
                } catch (e) {
                    throw new Error('Message DB server error: ' + e)
                }
                const chatBox = await ChatBoxModel.findOne({ name })
                chatBox.messages = [...chatBox.messages, message]
                await chatBox.save()

                broadcastToRoom(name, ['message', { sender: who, body }])
                break
            }

            case 'CHAT': {
                const { name } = payload
                ws.box = name
                await pub.sadd(`room:${name}`, ws.id)
                break
            }

            case 'FULFILL': {
                const { id } = payload
                broadcastToRoom(ws.box, ['fulfill', id])
                break
            }
        }
    },
}
