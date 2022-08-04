//var swal1 = swal();
const socket = io();
var nm;
const textarea = document.querySelector('#textarea');
const messageArea = document.querySelector('.msg_area');
const ul = document.querySelector('ul.users');
const btn = document.querySelector('.btn');
let users = [];
const userform = document.querySelector('.model');
const back = document.querySelector('.backdrop');
const usernm = document.querySelector('input');

//receive from server
socket.on('users', function (_users) {
    console.log('SocketID ==>',socket.id);
    users = _users;
    updateUser()
});

userform.addEventListener('submit', userHandler);

//Update the list of online users.
function updateUser() {
    ul.textContent = '';
    for (let i = 0; i < users.length; i++) {
        let node = document.createElement("li");
        let textnode = document.createTextNode(users[i]);
        node.classList.add('users-li');
        node.appendChild(textnode);
        ul.appendChild(node);
    }
}

//disapper the form after taking user's name
function userHandler(e) {
    e.preventDefault();
    nm = usernm.value;

    if (!nm) {
        return alert('Please enter name!!');
    }
    //send to server
    socket.emit('adduser', nm);
    userform.classList.add('disappear')
    back.classList.add('disappear');
    //socket.emit('disconnected', showNotification(nm+ " Left the chat!!"));
}

// take user's name via prompt box.
//console.log(time);
// do {
//     nm = prompt('Please Enter your name:');
//     socket.on('users', )
// } while (!nm);

//Will send message if click enter button from key board.
textarea.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        if (e.target.value == "") {
            alert('Please Enter message 1st!!')
        }
        else {
            sendMessage(e.target.value)
            textarea.value = "";
        }
    }
})

//Will send message if click on send button.
btn.addEventListener('click', () => {
    if (textarea.value == "") {
        // swal({
        //     title: "Please Enter message 1st!!",
        //     icon: "warning",
        //     button: "OK"
        // })
        alert('Please enter message first!!');
    }
    else {
        sendMessage(textarea.value)
        textarea.value = "";
    }
})

//Append new messages in chat section
function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'msg');
    let markUp = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <h5>${msg.time1}</h5>
        `
    mainDiv.innerHTML = markUp;
    messageArea.appendChild(mainDiv);
}

//Send the appended message to all the online users
function sendMessage(message) {
    let datetime = new Date;
    let time = datetime.toLocaleTimeString();
    let msg = {
        user: nm,
        message: message,
        time1: time
    }
    appendMessage(msg, 'outgoing');
    scroll();

    //send to server
    socket.emit('message', msg);
}

//receive message
socket.on('message', (mess) => {
    appendMessage(mess, 'incoming')
    showNotification(`${mess.user} : ${mess.message}`);
    scroll();
})

//code for show notification
const displayNotification1 = () => {
    let noti = new Notification('Hike Messanger', {
        body: 'This is Chat Application!!',
        timestamp: 1000
    });
    setTimeout(() => {
        noti.close();
    }, 10 * 1000);
    noti.addEventListener('click', () => {
        window.open("https://www.google.com", "_blank");
    });
};

const showError = () => {
    console.log('Error Occured');
};

let granted = false;
(async () => {
    if (Notification.permission === 'granted') {
        granted = true;
    }
    else if (Notification.permission !== 'denied') {
        let permission = await Notification.requestPermission();
        granted = permission === 'granted' ? true : false;
    }
    granted ? displayNotification1() : showError();
})();

function showNotification(a = 'not defined') {
    let displayNotification = () => {
        let notification = new Notification('Hike!!', {
            body: a,
            timestamp: 1000,
        });
        setTimeout(() => {
            notification.close();
        }, 10 * 1000);

        notification.addEventListener("click", () => {
            window.open("https://www.google.com", "_blank");
        });
    };
    granted ? displayNotification() : showError();
}


// receive new messages(if we don't want to scrolldown by our self)
function scroll() {
    messageArea.scrollTop = messageArea.scrollHeight;
}