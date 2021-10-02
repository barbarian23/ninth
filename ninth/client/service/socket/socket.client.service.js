import io from 'socket.io-client';

function socketClient(url) {
    socketClient.instance = io.connect(url);
    //socketClient.instance.emit("login", { username: "data.value.username", password: "data.value.password" });
    let socketCLI = {
        receive: function (type, callback) {
            socketClient.instance.on(type, function(data){
                callback(data);
            });
        },
        send: function (type, data) {
            socketClient.instance.emit(type, data);
        }
    }
    return socketCLI;
}
export default socketClient;