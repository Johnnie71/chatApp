const users = [];

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validating data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    //Check for existing user
    const exisitingUser = users.find((user) => {
        return user.room === room && user.username === username;
    })

    //Validate username
    if(exisitingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //Storing user
    const user = { id, username, room };
    users.push(user);
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room)
}

addUser({
    id: 22,
    username: 'Johnnie',
    room: 'NYC'
})

addUser({
    id: 42,
    username: 'Marco',
    room: 'NYC'
})

addUser({
    id: 32,
    username: 'Jorge',
    room: 'PR'
})

const userList = getUsersInRoom('NYC');

console.log(userList)



// console.log(getUser(22));