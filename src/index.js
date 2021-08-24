const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    // send message to the current user 
    // sends message to every user but the current user

    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room  });

        if(error){
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`));
        
        callback();
    })

    //server listens for client side message and sends a universal message to all
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback()
    })

    //server listens to see if someone leaves the chat and lets the other users know!
    socket.on('disconnect', () => {
       const user = removeUser(socket.id);

       if(user){
        io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
       }

        
    })

    //server listens to see if client side clicks to share location then shares with everyone
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback()
    })

})

server.listen(port, () => {
    console.log(`Port is up and running on port ${port}!`)
})