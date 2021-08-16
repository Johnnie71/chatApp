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

    socket.emit('message', 'Welcome!');

    //server listens for client side message and sends a universal message to all
    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    })

})

server.listen(port, () => {
    console.log(`Port is up and running on port ${port}!`)
})