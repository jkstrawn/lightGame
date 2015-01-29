var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

var players = [];

io.on('connection', function(socket) {
	var id = players.length;
	players.push({id: id, position: socket});
	socket.emit("connected", id);

	console.log('a user connected');
	socket.on('move', function(msg) {
		msg.id = id;
		console.log(msg);
		io.emit('moved', msg);
	});
});
http.listen(port, function() {
	console.log('listening on *:' + port);
});