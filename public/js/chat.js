const socket = io();

//client side listens for a message and displays it 
socket.on('message', (message) => {
    console.log(message)
})

//getting the form element
const form = document.querySelector('#chatForm');

//event listener to be able to send message on submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    //getting value for the input
    const message = e.target.elements.message

    //client side sends a message to the server upon submit
    socket.emit('sendMessage', message)
})