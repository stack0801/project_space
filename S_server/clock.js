const S_DB = require('./src/S_DB')

async function clock() {
    const list = await S_DB.S_object.find();

    for(let o of list) {
        o.x += o.dx
        o.y += o.dy
        o.save()
    }
}

interval = setInterval(() => {clock()}, 29)

module.exports = {
    S_clock : clock()
}