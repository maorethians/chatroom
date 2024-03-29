const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('join', deparam(), function (err) {
        if (err) {
            alert('invalid name');
            window.location.href = 'index.html';
        } else {
            console.log('welcome');
        }
    })
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    var div = document.createElement('div');
    div.innerHTML = `<span style="background: rgba(204, 230, 255, 0.5); padding: 5px; box-shadow: 3px 3px 3px grey; border-radius: 5px">${message.from}: ${message.text}<sub style="color:grey"> ${message.at}</sub></span>`;
    div.style.marginTop = '15px';
    document.getElementById('messages').appendChild(div);
    scrollButtom();
});
socket.on('newLocation', (location) => {
    var div = document.createElement('div');
    div.innerHTML = `<span style="background: rgba(204, 230, 255, 0.5); padding: 5px; box-shadow: 3px 3px 3px grey; border-radius: 5px">${location.from}: <a href="https://maps.google.com/?q=${location.latitude},${location.longitude}" target="_blank">Location</a><sub style="color: grey"> ${location.at}</sub></span>`;
    div.style.marginTop = '15px';
    document.getElementById('messages').appendChild(div);
    scrollButtom();
});
socket.on('newUser', function (name) {
    var div = document.createElement('div');
    div.innerHTML = `<span style="background: rgba(204, 230, 255, 0.5); padding: 5px; box-shadow: 3px 3px 3px grey; border-radius: 5px">${name}</span>`;
    div.style.marginTop = '15px';
    document.getElementById('peoplePanel').appendChild(div);
});
socket.on('allUsers', function (users) {
    for (name of users) {
        var div = document.createElement('div');
        div.innerHTML = `<span style="background: rgba(204, 230, 255, 0.5); padding: 5px; box-shadow: 3px 3px 3px grey; border-radius: 5px">${name}</span>`;
        div.style.marginTop = '15px';
        document.getElementById('peoplePanel').appendChild(div);
    }
});
socket.on('exitUser', function (name) {
    var peoplePanel = document.getElementById('peoplePanel');
    for (child of peoplePanel.children) {
        if (child.children[0].innerHTML === name) {
            peoplePanel.removeChild(child);
        }
    }
});


function sender() {
    var text = document.getElementById('message').value;
    socket.emit('createMessage', {
        from: 'user',
        text
    }, function () {
        document.getElementById('message').value = "";
    });
}

function getLocation() {
    var location = document.getElementById('location');
    if (!navigator.geolocation) {
        return alert('unable to get your location')
    }
    location.disabled = true;
    location.value = "Sending...";
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocation', {
            from: 'user',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            location.disabled = false;
            location.value = "Location";
        })
    }, function () {
        alert('location access denied!');
        location.disabled = false;
        location.value = "Location";

    })
}

function load() {
    var peoplePanel = document.getElementById('peoplePanel');
    peoplePanel.style.height = window.innerHeight + "px";
    peoplePanel.style.width = window.innerWidth / 6 + "px";
    peoplePanel.style.backgroundSize = window.innerWidth / 6 + "px " + window.innerHeight + "px";
    var messagePanel = document.getElementById('messagePanel');
    messagePanel.style.height = window.innerHeight + "px";
    messagePanel.style.width = 5 * window.innerWidth / 6 + "px";
    messagePanel.style.left = (window.innerWidth / 6 + 5) + "px";
    messagePanel.style.backgroundSize = 5 * window.innerWidth / 6 + "px " + window.innerHeight + "px";
    var message = document.getElementById('message');
    message.style.width = (5 * window.innerWidth / 6 - 210) + "px";
    message.focus();
    document.getElementById('send').style.left = (5 + 5 * window.innerWidth / 6 - 210) + "px";
    document.getElementById('location').style.left = (5 + 5 * window.innerWidth / 6 - 210 + 70) + "px";
    document.getElementById('input').style.top = (window.innerHeight - 40) + "px";
    var messages = document.getElementById('messages');
    messages.style.height = (window.innerHeight - 60) + "px";
    messages.style.width = (5 * window.innerWidth / 6 - 30) + "px";
}

function keyClick(event) {
    if (event.keyCode === 13) {
        sender();
    }
}

function scrollButtom() {
    var messages = document.getElementById('messages');
    if (messages.clientHeight + messages.scrollTop + 80 >= messages.scrollHeight) {
        messages.scrollTop = messages.scrollHeight;
    }
}

function deparam() {
    var uri = window.location.search;
    var queryString = {};
    uri.replace(
        new RegExp(
            "([^?=&]+)(=([^&#]*))?", "g"),
        function ($0, $1, $2, $3) {
            queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
    );
    return queryString;
}

