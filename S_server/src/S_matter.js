const S_DB = require('./S_DB')
const Matter = require('../../S_Client/script/matter.min.js')

var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Body = Matter.Body;

var engine = Engine.create();
var world = engine.world;

Engine.update(engine, [delta=16.666], [correction=1])
engine.gravity.y = 0

async function get_all() {
    const data = await S_DB.S_object.find()

    for (var o of data) {
        var new_object = Bodies.fromVertices(o.x, o.y, o.Vertices, {}, true);
        new_object.id = o.id;
        Composite.add(world, new_object);
    }
}

get_all()

var runner = Runner.create();
Runner.run(runner, engine);


Events.on(engine, 'afterUpdate', async(event) => {

    const list = Composite.allBodies(world)
    let data = []
    for(let o of list) {
        if(o.position.x > 1500 || o.position.x < -10 || o.position.y > 1000 || o.position.y < -10) {
            o.position.x = 400
            o.position.y = 400
            Body.setVelocity(o, { x: 0, y: 0})
        }
    }

    /*
    const list = Composite.allBodies(world)
    let buff

    for(let o of list) {
        buff = await S_DB.S_object.find({id : o.id})

        buff[0].x = o.position.x
        buff[0].y = o.position.y

        buff[0].dx = o.velocity.x
        buff[0].dy = o.velocity.y

        buff[0].save()
    }

    var time = engine.timing.timestamp;
    console.log(time)
    */
});


module.exports = {
    S_Composite : Composite,
    S_world : world,
    S_Bodies : Bodies,
    S_Body : Body
}