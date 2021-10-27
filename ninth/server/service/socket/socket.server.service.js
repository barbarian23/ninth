import { MAIN_URL } from "../../../common/constants/common.constants";

function socketServer(server) {
    socketServer.io = require('socket.io')(server, {
        wsEngine: 'ws'
    });
    console.log("socketServer");
    let socketCLI = {
        receive: function (receive) {
            socketServer.io.on('connection', (client) => {
                receive(client);
            });
        },
        send: function (type, data) {
            try {
                socketServer.io.emit(type, data);
            } catch (e) {
                console.log("socketServer eror when send data", data, "server says", e);
            }
        }
    }
    return socketCLI;
}
export default socketServer;