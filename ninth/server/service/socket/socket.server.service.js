function socketServer(server) {
    socketServer.io = require('socket.io')(server);
    console.log("socketServer");
    let socketCLI = {
        receive: function (receive) {
            socketServer.io.on('connection', (client) => {
                receive(client);
            });
        },
        send: function(type,data){
            socketServer.io.emit(type,data);
        }
    }
    return socketCLI;
}

export default socketServer;