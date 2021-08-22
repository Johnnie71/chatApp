const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    // send message to the current user 
    socket.emit('message', {
        text: 'Welcome!',
        createdAt: new Date().getTime()
    });

    // sends message to every user but the current user
    socket.broadcast.emit('message', 'A new user has joined!')

    //server listens for client side message and sends a universal message to all
    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message);
        callback("Delivered!")
    })

    //server listens to see if someone leaves the chat and lets the other users know!
    socket.on('disconnect', () => {
        io.emit('message', 'User has left!')
    })

    //server listens to see if client side clicks to share location then shares with everyone
    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
        callback()
    })

})

server.listen(port, () => {
    console.log(`Port is up and running on port ${port}!`)
})