const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const S_DB = require('./src/S_DB')
const S_session = require('./src/S_session')

let interval

    // register middleware in Express
app.use(S_session.s_middleware);
    // register middleware in Socket.IO 
io.use((socket, next) => {
    S_session.s_middleware(socket.request, {}, next);
    // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
    // connections, as 'socket.request.res' will be undefined in that case
});

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

const connect = async (req, res) => {
    const result = await S_DB.S_user.find({id : req.body.id, pw : req.body.pw})

    if(result.length == 0) {
        const new_user = new S_DB.S_user({ id: req.body.id, password: req.body.pw })
        const new_object = new S_DB.S_object({ id: req.body.id })

        await new_user.save()
        await new_object.save()
    }

    req.session.Auth = req.body.id
    res.redirect("/")
}

app.post('/connect', (req, res) => {
    connect(req, res).catch(err => console.log(err))
})

io.on('connection', (socket) => {
    console.log('a user connected')
    interval = setInterval(() => {send()}, 30)

    socket.on('disconnect', () => {
        console.log('user disconnected')
        clearInterval(interval)
    })

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg)
    })

    socket.on('order', async (msg) => {
        const target = await S_DB.S_object.find({ id : socket.request.session.Auth });

        switch (msg) {
            case 'w' :
                target[0].dy -= 5
                break
            case 'a' :
                target[0].dx -= 5
                break;
            case 's' :
                target[0].dy += 5
                break;
            case 'd' :
                target[0].dx += 5
                break;
        }

        target[0].save()
    })
})

async function send() {
    const list = await S_DB.S_object.find()
    io.emit('location', list)
}

server.listen(3000, () => {
    console.log(`server started listening on port ...!`)
})