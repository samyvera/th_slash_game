const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../client'));

var Brain = require('./lib/brain');
// var brain = new Brain();

io.on('connection', socket => {
    console.log('Connection : ' + socket.id);

    socket.on('join', () => socket.emit('welcome'));
    
    socket.on('disconnect', () => console.log('Disconnect : ' + socket.id));
});

http.listen(process.env.PORT || 3000);