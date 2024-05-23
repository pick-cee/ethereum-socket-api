import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { login, register } from './controllers/auth.controller'
import { setupSocketIO } from './controllers/socket.controller'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

setupSocketIO(io)
app.use(express.json())

// auth routes 
app.post('/auth/register', register)
app.post('/auth/login', login)

//health chech route
app.get('/', (req, res) => {
    res.status(200).send('Server up')
})

export default server