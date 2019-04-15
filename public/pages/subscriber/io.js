var connected = false;

var ioUrl;
if (window.location.hostname === "ycy.dev"){
    ioUrl = "https://ycy.dev:3315";
}else{
    ioUrl = "http://localhost:8315";
}

function ConnectIO(){
    if (connected){
        return;
    }
    connected = true;
    var url = ioUrl;
    var socket = io(url, {
        path: "/chat",
        transports: ['websocket'],
        reconnection: false
    });
    socket.emit("join", nickname);
    socket.on("userList", function(users){
        console.log("users", users);
        users.forEach(function(user){
            var elem = $('<li></li>');
            elem.text(user.nickname);
            elem.attr("id", "socket_" + user.socketId);
            $("#onlineUsers").empty().append(elem);
        });
    });
    socket.on("userJoined", function(obj){
        var nickname = obj.nickname;
        var userTotal = obj.userTotal;
        var socketId = obj.socketId;
        $("#userCount").text(userTotal);
        var elem = $('<li></li>');
        elem.text(nickname);
        elem.attr("id", "socket_" + socketId);
        $("#onlineUsers").append(elem);
    });

    socket.on("userLeft", function(obj){
        console.log("userLeft", obj);
        var nickname = obj.nickname;
        var userTotal = obj.userTotal;
        var socketId = obj.socketId;
        $("#userCount").text(userTotal);
        var elem = $('#socket_' + socketId);
        elem.remove();
    });
}