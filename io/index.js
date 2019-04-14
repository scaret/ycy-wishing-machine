const http = require("http");
const https = require("https");
const fs = require("fs");

var isHttps = false;
var server = null;
try{
    const key = fs.readFileSync("/etc/letsencrypt/live/ycy.dev/privkey.pem", "utf-8");
    const cert = fs.readFileSync("/etc/letsencrypt/live/ycy.dev/fullchain.pem", "utf-8");
    server = https.createServer({key, cert});
    isHttps = true;
}catch(e){
    server = server = http.createServer();
}

const io = require('socket.io')(server, {
    path: '/chat',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

var sockets = [];
var socketId = 0;

io.on("connection", (socket)=>{
    socket.socketId = socketId++;
    socket.on("join", (nickname)=>{
        socket.nickname = nickname;
        socket.emit("userList", sockets.map((sock)=>{
            return {
                nickname: sock.nickname,
                socketId: socket.socketId
            }
        }));
        sockets.push(socket);
        sockets.forEach(function(sock){
            sock.emit('userJoined', {
                nickname: nickname,
                socketId: socket.socketId,
                userTotal: sockets.length
            });
        });
        socket.on("disconnect", function(){
            for (var i = sockets.length - 1; i >=0; i--){
                if (socket === sockets[i]){
                    sockets.splice(i, 1);
                }
                sockets.forEach(function(sock){
                    sock.emit('userLeft', {
                        nickname: socket.nickname,
                        socketId: socket.socketId,
                        userTotal: sockets.length
                    });
                });
            }
        });
    });
});

var port = isHttps ? 3315 :8315;
server.listen(port, "0.0.0.0", function(){
    console.log(`isHTTPS ${isHttps} Port ${port}`);
});