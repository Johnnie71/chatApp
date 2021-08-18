const socket = io();

//Elements
const $form = document.querySelector('#chatForm');
const $formInput = $form.querySelector('input');
const $formButton = $form.querySelector('button');

//client side listens for a message and displays it 
socket.on('message', (message) => {
    console.log(message)
})


//event listener to be able to send message on submit
$form.addEventListener('submit', (e) => {
    e.preventDefault();

    //disabling button so it cant repeat a send 
    $formButton.setAttribute('disabled', 'disabled')

    //getting value for the input
    const message = e.target.elements.message.value

    //client side sends a message to the server upon submit
    socket.emit('sendMessage', message, (message) => {

        // enabling button after sending message then clearing input then focusing pointer
        $formButton.removeAttribute('disabled');
        $formInput.value = "";
        $formInput.focus();


        console.log('the message was delivered!', message)
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
        }, () => {
            console.log('Location shared!')
        });
    })
})