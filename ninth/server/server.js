import '@babel/polyfill';
// import compression from "compression";
import express from "express";
//import bodyParser from 'body-parser';
import path from "path";
import router from "./router/main.router";
import cors from "cors";
import { PORT } from "../common/constants/common.constants";
import workingController from "./controller/work/work.controller";

const app = express();
app.set('port', PORT);

// app.use(compression());

//sử dụng thư mục static
app.use("/static", express.static(path.resolve(__dirname, "public")));

//middleware được sử dụng để nhận các request từ client
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.urlencoded({ extended: true }));

// app.use("/*",router); - chỉ dùng với đối tượng app.router, ở đây đang dùng socket với htttp createserver
//tất cả các đường url đều render ra reactjs
//client và server giao tipees qua socket
app.all("/*",router);

//socket
const http = require('http');
const server = http.createServer(app);

// const io = require('socket.io')(server);

// io.on('connection', (client) => {
//     console.log("connect");
//     client.on("login",(d)=>{
//         console.log(d);
//         io.emit("login-status",{data:"yea"});
//     });
// });


workingController(server);

server.listen(app.get('port'), () => console.log("######## app running on port " + PORT + " ########"));