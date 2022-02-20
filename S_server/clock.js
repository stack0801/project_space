const S_DB = require('./src/S_DB')
const Matter = require('../S_Client/script/matter.min.js')

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Body = Matter.Body;

var engine = Engine.create();
var world = engine.world;

engine.gravity.y = 0;

var runner = Runner.create();
Runner.run(runner, engine);

Events.on(engine, 'afterUpdate', async(event) => {

    const list = Composite.allBodies(world)
    let buff

    for(let o of list) {
        buff = await S_DB.S_object.find({id : o.id})

        console.log(o.position)

        buff[0].x = o.position.x
        buff[0].y = o.position.y

        buff[0].dx = o.velocity.x
        buff[0].dy = o.velocity.y

        buff[0].save()
    }

    var time = engine.timing.timestamp;
    console.log(time)
});

/*
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
*/


module.exports = {
    S_Composite : Composite,
    S_world : world,
    S_Bodies : Bodies,
    S_Body : Body
}