const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const path = require('path');
const port = 5000;
//const swal = require('sweetalert')(httpServer);
const io = require('socket.io')(httpServer);

//It will run the file, which we will define here 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//for accessing all the public files like images, css files, js files, text file etc.
app.use(express.static(path.join(__dirname, '/public')));

const users = [];
//socket code
io.on('connection', (socket) => {
    console.log(socket.id,'connected!!');
    
    //When user enter thier name and start chatting, it will update online user's list
    socket.on('adduser', (usernm) => {
        socket.user = usernm;
        users.push(usernm);
        console.log(users);
        io.emit('users', users); //To display currently online users to all the users.
    });

    //It will broadcast the message to all the users, which are currently logged in
    socket.on('message', (mess) => {
        console.log("message data => ",mess.message);
        socket.broadcast.emit('message', mess);
    });  

    //when user close the window, it will update online user's list
    socket.on('disconnect', () => {
        console.log(socket.user, 'disconnected');
        //const a = `${socket.user}, 'disconnected'`;
        if (socket.user) {
            users.splice(users.indexOf(socket.user), 1);
          //delete socket.user[socket.id];
        }
        socket.broadcast.emit('users', users);
        console.log(users);
        //return a;
    });
    socket.on('typing',() => socket.broadcast.emit('typing'));
    socket.on('stop typing',() => socket.broadcast.emit('stop typing'))
});

httpServer.listen(port, console.log(`Server running on port ${port}!!`));