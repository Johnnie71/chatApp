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