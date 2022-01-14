var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);


var path = require('path');
app.use(express.static(path.join(__dirname, './chat')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chat/index.html');
});


var name;

const port = process.env.PORT || 3000

const socket = require("socket.io");
//const { exit } = require('process');


//Socket setup
const io = socket(server, { origin: "*:*" });

io.on("connection", function (socket) {

    console.log('new user connected');

    socket.on('joining msg', (username) => {
        name = username;
        io.emit('chat message', `---${name} joined the chat---`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('chat message', `---${name} left the chat---`);

    });
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
    });
});
server.listen(port, function () {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});

//var io = require('socket.io')(server, { origin: "*:*" });
//io.on('connection', (socket) => {
//    console.log('new user connected');

//    socket.on('joining msg', (username) => {
//        name = username;
//        io.emit('chat message', `---${name} joined the chat---`);
//    });

//    socket.on('disconnect', () => {
//        console.log('user disconnected');
//        io.emit('chat message', `---${name} left the chat---`);

//    });
//    socket.on('chat message', (msg) => {
//        socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
//    });
//});

//server.listen(3000, () => {
//    console.log('Server listening on :3000');
//});