var socket = io();

var message = document.getElementById('message'),
      send = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      username = document.getElementById('username');

// Emit events
send.addEventListener('click', function(){
    if(message.value === ''){
      return alert('Message field is empty');
    }
    socket.emit('chat', {
        message: message.value,
        username:username.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', username.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
