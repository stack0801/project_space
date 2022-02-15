const S_DB = require('./src/S_DB')

async function clock() {
    const list = await S_DB.S_object.find();

    for(let o of list) {
        o.x += o.dx
        o.y += o.dy
        o.a += o.da

        if(o.x > 10000 || o.x < -10000)
            o.x *= -1
        if(o.y > 10000 || o.y < -10000)
            o.y *= -1

        
        if(o.dx > 0) o.dx--
        if(o.dx < 0) o.dx++

        if(o.dy > 0) o.dy--
        if(o.dy < 0) o.dy++
        

        if(o.dx > 1000) o.dx = 1000
        if(o.dx < -1000) o.dx = -1000

        if(o.dy > 1000) o.dy = 1000
        if(o.dy < -1000) o.dy = -1000

        o.save()
    }
}

interval = setInterval(() => {clock()}, 29)

module.exports = {
    S_clock : clock()
}