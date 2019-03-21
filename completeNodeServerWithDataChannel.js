'use strict';

var express = require('express');
var socketIO = require('socket.io');
const path = require('path');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname,'client', 'index.html');


const server = express()
    .use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log('Listening on ${PORT}'));


const io = socketIO(server);

// Let's start managing connections...
io.on('connection', function (socket){
    socket.on('create or join', function (room) { // Handle 'create or join' messages
        var numClients = io.adapter.rooms[room]?io.adapter.rooms[room].length:0;

        console.log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
        console.log('S --> Request to create or join room', room);

        if(numClients == 0){ // First client joining...
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) { // Second client joining...
            io.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        } else { // max two clients
            socket.emit('full', room);
        }
    });

    socket.on('message', function (message) { // Handle 'message' messages
        console.log('S --> got message: ', message);
        // channel-only broadcast...
        socket.broadcast.to(message.channel).emit('message', message);
    });

    function log(){
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        socket.emit('log', array);
    }

});


module.exports = server;

