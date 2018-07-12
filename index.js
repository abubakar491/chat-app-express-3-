const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const MongoClient = require('mongodb').MongoClient;


const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;

// App setup
var app = express();
var server = http.createServer(app);
var io = socket(server);

// Static files
app.use(express.static('public'));

//mongodb
const url = 'mongodb://127.0.0.1/chat';

MongoClient.connect(url, (err, db) => {
	if(err){
		console.log('Error in connection', err);
	}
	console.log('connection succesfull');

	io.on('connection', (socket) => {

		db.collection('chat').find().limit(20).sort({_id:1}).toArray(function(err, result){
            if(err){
                throw err;
            }

            //console.log(JSON.stringify(result, undefined, 2));

            // Emit the messages
            socket.emit('ichat', result);
        });

		console.log('made socket connection', socket.id);

		socket.on('chat', function(data){

			if(data.username === ""){
			  	data.username = socket.id;
			}

			io.emit('chat', data);

			db.collection('chat').insert(
			    {
			       name:data.username,
			       message:data.message

			    }, (err, result) => {
						if(err){
						console.log('Error');
						}
			});
		});

		socket.on('typing', function(data){
			socket.broadcast.emit('typing', data);
		});
	});
});
	

server.listen(port);
