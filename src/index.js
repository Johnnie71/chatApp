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

let count = 0;

io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        socket.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log(`Port is up and running on port ${port}!`)
})