import express from 'express'
import cors from 'cors'
import routes from './routes'
import mongoose from 'mongoose'
import WebSocket from 'ws'
import bodyParser from 'body-parser'
import http from 'http'
import wsConnect from './wsConnect'
import { randomUUID } from 'crypto'
import path from 'path'
import jwt from 'jsonwebtoken'

require('dotenv').config()

const app = express()

// if (process.env.NODE_ENV === "development") {
//     app.use(cors());
// }
app.use(cors())

app.use(express.json())
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

routes(app)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    if (process.env.NODE_ENV !== 'production') {
        console.error(err)
    }
    res.status(statusCode).json({
        message: 'error',
        content: err.message || 'Internal server error',
    })
})

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve()
    app.use(express.static(path.join(__dirname, '../frontend', 'build')))
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const server = http.createServer(app)
const wss = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
        const url = new URL(info.req.url, `http://${info.req.headers.host}`)
        const token = url.searchParams.get('token')
        if (!token) {
            return done(false, 401, 'No token provided')
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            info.req.userId = decoded.userId
            done(true)
        } catch (err) {
            done(false, 401, 'Invalid token')
        }
    },
})

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'NTUBuyMe',
    })
    .then((res) => {
        wss.on('connection', (ws, req) => {
            ws.box = ''
            ws.id = randomUUID()
            ws.userId = req.userId
            wsConnect.registerClient(ws)
            ws.onmessage = wsConnect.onMessage(wss, ws)
            ws.on('close', () => {
                wsConnect.unregisterClient(ws)
            })
            ws.on('error', (err) => {
                console.warn(`Client disconnected - reason: ${err}`)
                wsConnect.unregisterClient(ws)
            })
        })
    })

server.listen(8080, () => {
    console.log('listening on port 8080')
})
