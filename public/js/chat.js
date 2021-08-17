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
    const message = e.target.elements.message.value

    //client side sends a message to the server upon submit
    socket.emit('sendMessage', message)
})

const location = document.querySelector('#send-location');

location.addEventListener('click', (e) => {
    e.preventDefault();

    // if browser does not support geolocation
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }
})