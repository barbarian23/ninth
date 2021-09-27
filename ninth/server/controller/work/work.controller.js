import socketServer from "../../service/socket/socket.server.service";
// import csvService from "../../service/csv/csv.server.service";
import {
    SOCKET_LOGIN,
    SOCKET_OTP,
    SOCKET_WORKING_START_CRAWL_DATA,
    SOCKET_CRAWLED_DONE
} from "../../../common/constants/common.constants";
import doLogin from "../work/login.controller";
import doOTPChecking from "../work/otp.controller";
import doGetInfomation from "../work/home.controller";
import { forEach } from "lodash";

const puppeteer = require('puppeteer');
//C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe
//C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe hình như là application]chrome.exe
let exPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
var driver, browser;

//puppeteer
//socket
var socket = null;
var excel = require('excel4node');
var wb, ws;
var fileName;
var THRESLDHOLD = 50;
const MIN_TIME = 2000;
var line = 2;//bỏ qua header và excel abwts đầu từ một

const preparePuppteer = function () {
    return new Promise(async (res, rej) => {
        try {
            let browser = await puppeteer.launch({
                args: ["--no-sandbox", "--proxy-server='direct://'", '--proxy-bypass-list=*'],
                headless: true,
                ignoreHTTPSErrors: true,
                executablePath: exPath == "" ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : exPath
            })

            // let pageLogin = await browser.newPage();
            // pageLogin.setViewport({ width: 2600, height: 3800 });

            res(browser);
        } catch (e) {
            rej(e);
        }
    });
}

const workingController = async function (server) {
    try {
        browser = await preparePuppteer();
        driver  = await browser.newPage();
        driver.setViewport({ width: 2600, height: 3800 });

        //khoi tao socket 
        socket = socketServer(server);
        socket.receive((receive) => {
            //login
            receive.on(SOCKET_LOGIN, login);

            //otp
            receive.on(SOCKET_OTP, doOTP);

            //tra cứu số
            receive.on(SOCKET_WORKING_START_CRAWL_DATA, doGetInfor);
        });
    } catch (e) {
        console.error("loi puppteer hoac socket", e);

    }
}

//login
const login = async function (data) {
    try {
        console.log("login voi username va password", data.username, data.password);
        //let driver2 = await browser.newPage();
        doLogin(data.username, data.password, socket, driver, null); //driver 2 null
    } catch (e) {
        console.log("login error ", e);
    }
}

//otp
const doOTP = function (data) {
    try {
        console.log("Xac thuc voi OTP : ", data.otp);
        doOTPChecking(data.otp, socket, driver);
    } catch (e) {
        console.log("doOTP error ", e);
    }
}

// crawl data
const doGetInfor = async function (data) { // crawl data in table
    try {
        console.log("data from client: ", data);
        let mTime = data.time ? (data.time * 1000) : MIN_TIME;
        createFileExcel(data.nameFile);
        let style = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center'],
                wrapText: true,
            },
            font: {
                name: 'Arial',
                color: '#4e3861',
                size: 12,
            },
        });
        for (let index = 0; index < data.listPhone.length; index++) {
            console.log("Tra cuu so thu ", index, " phone ", data.listPhone[index]);
            let today = new Date();
            let tempLine = await doGetInfomation(line, data.listPhone[index].phone, data.listPhone[index].index, today.getFullYear() + '-' + (today.getMonth() + 1), ws, socket, driver, data.listPhone.length, style);
            line = tempLine;
            await timer(mTime);
            //cứ 50 só một lần, ghi lại vào file excel
            if (index % THRESLDHOLD == 0) {
                await wb.write(fileName);
            }
        }
        await wb.write(fileName);
        socket.send(SOCKET_CRAWLED_DONE, { data: 2 });
        line = 2;
    } catch (e) {
        console.log("doGetInfor error ", e);
    }
}
// timer
function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}
//// foreach
////prepare file xlsx to save data
//ghi ra từng ô
async function writeHeader(wb, ws) {
    try {
        let style = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center'],
                wrapText: true,
            },
            font: {
                bold: true,
                name: 'Arial',
                color: '#4e3861',
                size: 12,
            },
        });

        ws.cell(1, 1).string("STT").style(style);
        ws.cell(1, 2).string("SĐT").style(style);
        ws.cell(1, 3).string("BTS_NAME").style(style);
        ws.cell(1, 4).string("MA_TINH").style(style);
        ws.cell(1, 5).string("TOTAL_TKC").style(style);
    } catch (e) {
        console.log("e", e);
    }
}

const createFileExcel = function (data) {
    try {
        console.log(" file name from client", data);

        wb = new excel.Workbook();
        ws = wb.addWorksheet('Tra cứu');

        ws.column(1).setWidth(5);//STT
        ws.column(2).setWidth(30);//Số thuê bao,
        ws.column(3).setWidth(30);//BTS_NAME,
        ws.column(4).setWidth(30);//MA_TINH,
        ws.column(5).setWidth(30);//TOTAL_TKC

        writeHeader(wb, ws);
        let today = new Date();
        fileName = data + "_" + "Ngay " +  today.getDate() +" Thang " + (today.getMonth() + 1) + " Nam " + today.getFullYear()  + "_" + today.getHours() + " Gio " + today.getMinutes() + " Phut.xlsx";
        wb.write(fileName);

    } catch (e) {
        console.log("createFileExcel error ", e);
    }
}
////////////////////////


let random = () => {
    let rd = Math.floor(Math.random() * 10);
    console.log("number random", rd);
    return rd;
}

export default workingController;