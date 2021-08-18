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
    socket.emit('sendMessage', message, () => {
        console.log('the message was delivered!')
    })
})

const sendLocation = document.querySelector('#send-location');

sendLocation.addEventListener('click', (e) => {
    e.preventDefault();

    // if browser does not support geolocation
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        //client side emitting location with lat and long as an object to server
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    })
})