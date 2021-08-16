const socket = io();

socket.on('countUpdated', () => {
    console.log('Count has been updated!')
})