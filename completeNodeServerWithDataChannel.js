

var http = require('http');

var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);

app.use(express.static( __dirname +'/client'))

//Importamos las rutas
var routes = require('./routes');


//Asignamos al atributo 'port' un valor
app.set('port', (process.env.PORT || 8080))

//Cargamos las rutas
app.use('', routes);

// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(server);

// Let's start managing connections...
io.sockets.on('connection', function (socket){


    socket.on('create or join', function (room) { // Handle 'create or join' messages
        var numClients = io.sockets.adapter.rooms[room]?io.sockets.adapter.rooms[room].length:0;

        console.log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
        console.log('S --> Request to create or join room', room);

        if(numClients == 0){ // First client joining...
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) { // Second client joining...
            io.sockets.in(room).emit('join', room);
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

server.listen(app.get('port'), () => {
    console.log("Servidor ejecutandose en :" + app.get('port'))
})

module.exports = app;
