﻿var express = require('express');
var http = require('http');

const port = process.env.PORT || 3000

const net = require('net');
const pushsrv = net.createServer((c) => {
    // 'connection' listener
    console.log('client connected');
    c.on('end', () => {
        console.log('client disconnected');
    });

    c.on('data', (data) => {
        console.log(data.toString());
        c.write('Reply: ' + data.toString());
    });

    c.write('hello\r\n');
     // c.pipe(c);
});
pushsrv.on('error', (err) => {
    throw err;
});
pushsrv.listen(port, () => {
    console.log('server bound');
});



//var app = express();
//var server = http.createServer(app);


//var path = require('path');
//app.use(express.static(path.join(__dirname, './chat')));
//app.get('/chat', (req, res) => {
//    //debugger;
//    console.log(req.headers);
//    res.sendFile(__dirname + '/chat/index.html');
//}).post('/chat', (req, res) => {
//    //debugger;
//    // push the data to body
//    // console.log(req.headers);
//    var body = [];
//    req.on('data', (chunk) => {
//        body.push(chunk);
//    }).on('end', () => {
//        // on end of data, perform necessary action
//        body = Buffer.concat(body).toString();
//        //response.write(request.body.user);
//        //response.end();
//        console.log(body);
//    });
//});






//var name;



//const socket = require("socket.io");


////Socket setup
//const io = socket(server, { origin: "*:*" });

//io.on("connection", function (socket) {

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


//let routes = require('./api/routes'); //importing route
//routes(app, {
//    testsend:function (data) {
//        io.emit('chat message', data);
//    }
//})

////const request = require('request');
//app.use(function (req, res) {

//    //res.status(404).send({ url: req.originalUrl + ' not found' })
//    //res.status(301).redirect('https://hrpro.cf/pages/invoice.html' + req.url) // 'http://192.168.1.91:10996/pages/testredirect.php?XDEBUG_SESSION_START=154A5348'
//    //console.log(req.body);
//    //res.writeHead(301,
//    //    { Location: 'http://192.168.1.91:10996/localsrc/ping.php?XDEBUG_SESSION_START=154A5348',fuck:'dumemay' }////'http://192.168.1.91:10996/pages/invoice.html'
//    //);
//    //redirect_post( req.body);

//    //var url = req.originalUrl;//'http://192.168.1.91:10996/te.php?XDEBUG_SESSION_START=154A5348' ;//'YOUR_API_BASE_URL' + req.url;
//    //var r = null;
//    //if (req.method === 'POST') {
//    //    r = request.post({ uri: url, json: req.body });
//    //} else {
//    //    r = request(url);
//    //}

//    //req.pipe(r).pipe(res);


//    res.end();
//})



//server.listen(port, function () {
//    console.log(`Listening on port ${port}`);
//    console.log(`http://localhost:${port}`);
//});
