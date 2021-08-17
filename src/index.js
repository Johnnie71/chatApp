const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    // send message to the current user 
    socket.emit('message', 'Welcome!');

    // sends message to every user but the current user
    socket.broadcast.emit('message', 'A new user has joined!')

    //server listens for client side message and sends a universal message to all
    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    })

    //server listens to see if someone leaves the chat and lets the other users know!
    socket.on('disconnect', () => {
        io.emit('message', 'User has left!')
    })

    //server listens to see if client side clicks to share location then shares with everyone
    socket.on('sendLocation', (location) => {
        console.log(location)
        io.emit('message', `Location: ${location.latitude}, ${location.longitude} ` )
    })

})

server.listen(port, () => {
    console.log(`Port is up and running on port ${port}!`)
})