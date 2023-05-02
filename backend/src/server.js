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
app.use('/api', routes)
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header(
        'Access-Control-Allow-Methods',
        'POST, GET, PUT, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve()
    app.use(express.static(path.join(__dirname, '../frontend', 'build')))
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.js'))
    })
}

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'NTUBuyMe',
    })
    .then((res) => {
        wss.on('connection', (ws) => {
            ws.box = ''
            ws.id = randomUUID()
            ws.onmessage = wsConnect.onMessage(wss, ws)
            ws.on('error', (err) => {
                console.warn(`Client disconnected - reason: ${err}`)
            })
        })
    })

server.listen(8080, () => {
    console.log('listening on port 8080')
})
