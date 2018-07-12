const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');


const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;

// App setup
var app = express();
var server = http.createServer(app);
// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    socket.on('chat', function(data){
    	
    	if(data.username === ""){
    		data.username = socket.id;
    	}

        io.emit('chat', data);

        //Insert Into Database
    });


    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

});

server.listen(port);
