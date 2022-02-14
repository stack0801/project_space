const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const S_DB = require('./src/S_DB')
const S_session = require('./src/S_session')(app)

let interval

app.use(express.urlencoded({ extended: true }))

app.use('/client', express.static('S_Client'))

app.get('', (req, res) => {
    if (req.session.Auth) {
        res.sendFile('/index.html', {root : 'S_client/html'})
    }
    else {
        res.sendFile('/login.html', {root : 'S_client/html'})
    }
})

app.post('/connect', (req, res) => {
    S_DB.S_user.find({id : req.body.id, pw : req.body.pw}, (error, result) => {
        if(error) {
            console.log(error)
        }
        else {
            if(result.length > 0) {
                req.session.Auth = req.body.id
                res.redirect("/")
            }
            else {
                const new_user = new S_DB.S_user({ id: req.body.id, password: req.body.pw})

                new_user.save((err, data) => {
                    if(error) {
                        console.log(err)
                    }
                    else {
                        req.session.Auth = req.body.id
                        res.redirect("/")
                    }
                })
            }
        }
    })
})

io.on('connection', (socket) => {
    console.log('a user connected')
    interval = setInterval(() => {send()}, 29)

    socket.on('disconnect', () => {
        console.log('user disconnected')
        clearInterval(interval)
    })

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg)
    })
})

async function send() {
    const list = await S_DB.S_user.find()
    io.emit('location', list)
}

server.listen(3000, () => {
    console.log(`server started listening on port ...!`)
})