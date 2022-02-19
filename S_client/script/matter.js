// module aliases
var Engine = Matter.Engine;
var Render = Matter.Render;
var Runner = Matter.Runner;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;

var window_width = window.innerWidth;
var window_height = window.innerHeight;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0;

// create a renderer
var render = Render.create({
    element: document.body,
    options: {
        width: window_width,
        height: window_height
    },
    engine: engine
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);