const socket = io();

//Elements
const $form = document.querySelector('#chatForm');
const $formInput = $form.querySelector('input');
const $formButton = $form.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;


//client side listens for a message and displays it 
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text
    });

    //inserting messages before the end of the template and inserting the HTML
    $messages.insertAdjacentHTML('beforeend', html);

})

// client side listening to server to send location
socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationTemplate, {url});
    $messages.insertAdjacentHTML('beforeend', html);
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

        // enabling button after sending message then clearing input then focusing back on the input
        $formButton.removeAttribute('disabled');
        $formInput.value = "";
        $formInput.focus();


        console.log('the message was delivered!', message)
    })
})



$sendLocation.addEventListener('click', (e) => {
    e.preventDefault();

    $sendLocation.setAttribute('disabled', 'disabled');

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
            $sendLocation.removeAttribute('disabled');
            console.log('Location shared!');
        });
    })
})