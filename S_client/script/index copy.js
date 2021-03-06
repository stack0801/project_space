var socket = io();

var message_bar = document.getElementById('message_bar');
var message_log = document.getElementById('message_log');
var message_input = document.getElementById('message_input');
var message_button = document.getElementById('message_button');

var S_canvas = document.getElementById('S_canvas');
var ctx = S_canvas.getContext('2d');

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

console.log("!!!!")

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'Insert':
            if(message_bar.style.display == 'flex')
                message_bar.style.display = 'none'
            else
            {
                message_bar.style.display = 'flex'
                message_input.focus()
            }
            break;
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
        default:
            console.log(e.key);
    }
})

window.addEventListener('keyup', e => {
    
})

message_button.addEventListener('click', () => {
    if (message_input.value) {
        socket.emit('chat message', message_input.value);
        message_input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    message_log.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('location', (data) => {
    ctx.clearRect(0, 0, S_canvas.width, S_canvas.height);
    for (var value of data) {

        const cx = S_canvas.width / 2 + value.x * S_canvas.width / 20000
        const cy = S_canvas.height / 2 + value.y * S_canvas.width / 20000

        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI*2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();

        ctx.fillText(value.id, cx, cy + 20)
    }
});
