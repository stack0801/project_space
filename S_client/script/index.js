var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Body = Matter.Body;

var window_width = window.innerWidth;
var window_height = window.innerHeight;

var engine = Engine.create();
var world = engine.world;

Engine.update(engine, [delta=16.666], [correction=1])
engine.gravity.y = 0;

var render = Render.create({
    element: document.body,
    options: {
        width: window_width,
        height: window_height
    },
    engine: engine
});

Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);

var i = Bodies.rectangle(400, 600, 800, 50.5);

Composite.add(world, [
    i
]);

var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
Composite.add(world, mouseConstraint);

var socket = io();

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'w' :
            socket.emit('order', 'w');
            break;
        case 'a' :
            socket.emit('order', 'a');
            break;
        case 's' :
            socket.emit('order', 's');
            break;
        case 'd' :
            socket.emit('order', 'd');
            break;
        case 'e' :
            console.log(Composite.allBodies(world))
            break;
        default:
            console.log(e.key);
    }
})

window.addEventListener('keyup', e => {
    
})

var buff;

socket.on('location', (data) => {
    for (var value of data) {
        buff = Composite.get(world, value.id, 'body')
        if(buff != null) {
            Body.setPosition(buff, { x: value.x, y: value.y });
            Body.setVelocity(buff, { x: value.dx, y: value.dy });
            console.log(value)
        }
        else {
            var new_object = Bodies.fromVertices(value.x, value.y, value.vertices, {}, true);
            new_object.id = value.id;
            Composite.add(world, new_object);
        }
    }
});

/*
Events.on(engine, 'afterUpdate', function(event) {
    var time = engine.timing.timestamp;
    console.log(time)
});
*/
