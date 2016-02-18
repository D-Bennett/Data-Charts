var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/web/index.html');
});
app.get('/data-fiddle', function(req, res){
	res.sendFile(__dirname + '/web/data-fiddle.html');
});

var io = require('socket.io')(http);

var data = {
	ram_used: 0,
    ram_avalible: 2048,
};

var update_data = function (key, value) {
	data[key] = value;
	io.emit('data', data);
};

io.on('connection', function(socket) {

	console.log("connect", socket.id);
	socket.emit('data', data);
	socket.on('disconnect', function(){
		console.log("disconnect", socket.id);
	});

	socket.on('use_256_ram', function() {
		if ((data.ram_used + 256) > data.ram_avalible) {
			update_data('ram_used', data.ram_avalible);
		} else {
			update_data('ram_used', (data.ram_used + 256));
		}
	});
	socket.on('use_256_ram_reduce', function() {
		if ((data.ram_used - 256) < 0) {
			update_data('ram_used', 0);
		} else {
			update_data('ram_used', (data.ram_used - 256));
		}
	});
	socket.on('use_no_ram', function() {
		update_data('ram_used', 0);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
