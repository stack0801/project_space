const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const S_DB = require('./src/S_DB')
const S_session = require('./src/S_session')
const S_matter = require('./clock')

let interval

app.use(S_session.s_middleware)

io.use((socket, next) => {
    S_session.s_middleware(socket.request, {}, next);
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

//test
app.get('/matter', (req, res) => {
    res.sendFile('/matter.html', {root : 'S_client/html'})
})

const connect = async (req, res) => {
    const result = await S_DB.S_user.find({id : req.body.id, pw : req.body.pw})

    if(result.length == 0) {
        const new_user = new S_DB.S_user({ id: req.body.id, password: req.body.pw })
        const new_object = new S_DB.S_object({ id: req.body.id })
        new_object.Vertices = [
            { x: 10, y: 0 }, 
            { x: 20, y: 0 }, 
            { x: 30, y: 10 }, 
            { x: 30, y: 20 }, 
            { x: 20, y: 30 }, 
            { x: 10, y: 30 },
            { x: 0, y: 20 }, 
            { x: 0, y: 10 }
        ]

        await new_user.save()
        await new_object.save()

        const new_object2 = S_matter.S_Bodies.fromVertices(0, 0, new_object.Vertices, {}, true);
        new_object2.id = req.body.id;
        S_matter.S_Composite.add(S_matter.S_world, new_object2);
    }

    req.session.Auth = req.body.id
    res.redirect("/")
}

app.post('/connect', (req, res) => {
    connect(req, res).catch(err => console.log(err))
})

io.on('connection', (socket) => {
    console.log('a user connected')
    interval = setInterval(() => {send()}, 100)

    socket.on('disconnect', () => {
        console.log('user disconnected')
        clearInterval(interval)
    })

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg)
    })

    socket.on('order', async (msg) => {
        const target = await S_DB.S_object.find({ id : socket.request.session.Auth })

        const body = S_matter.S_Composite.get(S_matter.S_world, socket.request.session.Auth, 'body')

        switch (msg) {
            case 'w' :
                //target[0].dy -= 5
                S_matter.S_Body.applyForce(body, body.position, { 
                    x: 0, 
                    y: -0.0001
                });
                break
            case 'a' :
                //target[0].dx -= 5
                S_matter.S_Body.applyForce(body, body.position, { 
                    x: -0.0001, 
                    y: 0
                });
                break;
            case 's' :
                //target[0].dy += 5
                S_matter.S_Body.applyForce(body, body.position, { 
                    x: 0, 
                    y: 0.0001
                });
                break;
            case 'd' :
                //target[0].dx += 5
                S_matter.S_Body.applyForce(body, body.position, { 
                    x: 0.0001, 
                    y: 0
                });
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