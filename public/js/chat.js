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
const sidebarTemplate = document.querySelector('#sidebar_template').innerHTML;

//Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    //Grab the new message
    const newMessageStyles = getComputedStyle($newMessage);
    //Getting the margin bottom value
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = $messages.offsetHeight;

    //Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        
    }
}


//client side listens for a message and displays it 
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    //inserting messages before the end of the template and inserting the HTML
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

// client side listening to server to send location
socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;

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

//sending username and room to server from the login
socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
})