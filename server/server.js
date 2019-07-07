const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../client'));

// var Brain = require('./lib/brain');
// var brain = new Brain();

var players = new Map();
var sockets = new Map();

io.on('connection', socket => {
    console.log('Connection : ' + socket.id);
    sockets.set(socket.id, socket);

    socket.on('join', () => {
        socket.emit('welcome');
        players.set(socket.id, { name:'Anonymous', score:0 });
    });

    socket.on('update', data => {
        if (data.name === '') data.name = 'Anonymous';
        if (data.name.length > 10) data.name = data.name.substring(0, 10);
        players.set(socket.id, { name:data.name, score:data.score });
    });
    
    socket.on('disconnect', () => {
        players.delete(socket.id);
        sockets.delete(socket.id);
    });
});

var updatePlayers = () => sockets.forEach(socket => {
    var leaderboard = [];
    players.forEach(player => leaderboard.push({ name:player.name, score:player.score }));
    socket.emit('update', leaderboard);
});
setInterval(updatePlayers, 1000);

http.listen(process.env.PORT || 3000);