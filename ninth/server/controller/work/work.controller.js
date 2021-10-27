import socketServer from "../../service/socket/socket.server.service";
import csvService from "../../service/csv/csv.server.service";
import {
    SOCKET_LOGIN,
    SOCKET_LOGIN_STATUS,
    SOCKET_GET_LIST_PHONE,
    SOCKET_LIST_PHONE,
    SOCKET_WORKING_SINGLE_NUMBER,
    SOCKET_WORKING_SOME_NUMBER,
    SOCKET_WORKING_ADDED_NUMBER,
    SOCKET_WORKING_ADDED_SOME_NUMBER,
    SOCKET_WORKING_DELETE_PHONE,
    SOCKET_WORKING_DELETED_PHONE,
    SOCKET_WORKING_EDITED_PHONE,
    SOCKET_WORKING_EDIT_PHONE,
    SOCKET_SETINTERVAL_PHONE,
    SOCKET_SETINTERVALED_PHONE,
    SOCKET_LOG,
    SOCKET_INTERVAL_ALL_PHONE_URL,
    SOCKET_INTERVAL_EACH_PHONE_URL
} from "../../../common/constants/common.constants";
import doLogin from "../work/login.controller";

import sseServer from "../../service/sse/sse.server.service";
import receive from "../reactjs/render.controller"; // render client

import { HOME_URL, WAIT_TIME, MAXIMUM_INTERVAL } from "../../constants/work/work.constants";
import { getListTdTag, getListMiddleNumber, getListNumberMoney, verifyNumberPhone } from "../../service/util/utils.server";

const puppeteer = require('puppeteer');
//C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe
//C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
let exPath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
var driver;

//biến đếm số lần chạy interval, nếu số lần chạy interval quá lướn, có thể khiến trình duyệt bị điw

var countInterval = 0, clearIntervalMax = null;

var socket = null;

// const seleniumInsstance = new seleniumCrawl();
const csvInstance = new csvService();

let arrayNumber = [
    // {
    //     number:"090090090",
    //     money:10000,
    //     interval:null,
    //     change:false,
    // }
];
try {
    arrayNumber = csvInstance.readFile();
} catch (e) {

}


const preparePuppteer = function () {
    return new Promise((res, rej) => {
        puppeteer.launch({
            args: ["--no-sandbox", "--proxy-server='direct://'", '--proxy-bypass-list=*'],
            headless: true,
            ignoreHTTPSErrors: true,
            executablePath: exPath == "" ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : exPath
        })
            .then(async (browser) => {
                let pageLogin = await browser.newPage();
                pageLogin.setViewport({ width: 2600, height: 3800 });

                res(pageLogin);
            }).catch(e => {
                rej(e);
            });

    });
}

const workingController = async function (server, app) {
    try {
        driver = await preparePuppteer();
        //khoi tao socket 
        socket = socketServer(server);
        console.log(server.app);
        socket.receive((receive) => {

            receive.on(SOCKET_LOGIN, login);

            //get list phone
            //trả về cho client danh sashc số đã lưu, đồng thời inject hàm getPhone vào trang web
            receive.on(SOCKET_GET_LIST_PHONE, getListPhone);

            //chuyển qua server sent event - SOCKET_SETINTERVALED_PHONE_URL
            // add number
            receive.on(SOCKET_WORKING_SINGLE_NUMBER, addNumber);

            // thêm sdt, số tiền qua file excel
            receive.on(SOCKET_WORKING_SOME_NUMBER, addSomeNumber);

            // delete sdt
            receive.on(SOCKET_WORKING_DELETE_PHONE, deletePhone);

            // edit sdt
            receive.on(SOCKET_WORKING_EDIT_PHONE, editPhone);

            //chuyển qua server sent event - SOCKET_SETINTERVALED_PHONE_URL
            // setinterval
            receive.on(SOCKET_SETINTERVAL_PHONE, prepareInterval);
        });

        app.all("/*", router);


    } catch (e) {
        console.error("loi puppteer hoac socket", e);

    }
}

//render ra file html    
const router = async function (req, res) {
    if (req.url.includes(SOCKET_INTERVAL_ALL_PHONE_URL)) {
        setIntervalPhone(res);
    } else if (req.url.includes(SOCKET_INTERVAL_EACH_PHONE_URL)) {
        console.log("each number", req.query.phone, req.query.money);
        addNumber({ phone: req.query.phone, money: req.query.money }, res);
    } else {
        receive(req, res);
    }
};

//lấy ra đoạn html bằng 1 đoạn javascript
const watchPhone = async (phone) => {
    return new Promise(async (res, rej) => {
        try {
            //let html = await driver.evaluate("(async function (){return await getPhone("+phone+")}())");

            let html = await driver.evaluate("getPhone(" + phone + ")");
            res(html);
        } catch (e) {
            console.log("error watchPhone", phone, e);
            rej(e);
        }
    });
}

//lấy ra các thẻ table từ đoạn html
const getListTrInTable = async (htmlContent) => {
    return new Promise(async (res, rej) => {
        let listTrTag = await getListTdTag(htmlContent);
        //await socket.send(SOCKET_LOG, { message: "list tr", data: listTrTag });
        res(listTrTag);
    });
}

//lấy ra number có thể kèm theo các ký tự đặc biệt như ><
const getMiddleNumber = (listTr) => {
    return new Promise(async (res, rej) => {
        let numberWithSpecial = await getListMiddleNumber(listTr);
        //await socket.send(SOCKET_LOG, { message: "number uiwth spcial tr", data: numberWithSpecial });
        res(numberWithSpecial);
    });
}

//lấy ra number từ 1 đoạn string có chứa số kèm theo 1 số ký tư đặc gbiejet như b><
const getNumberMoney = (numberSpecial) => {
    return new Promise(async (res, rej) => {
        let number = await getListNumberMoney(numberSpecial);
        //await socket.send(SOCKET_LOG, { message: "number", data: number });
        res(number);
    });
}

const getNumberInfo = async (phone, info) => {
    //let rd = Math.floor(Math.random() * 10);
    //console.log("number random", rd);
    return new Promise(async (res, rej) => {
        try {
            //lấy ra đoạn html
            let htmlContent = await watchPhone(phone);
            //console.log("htmlContent", htmlContent.length);
            //lấy ra các tr
            let listTr = await getListTrInTable(htmlContent);

            // console.log("listTr", listTr);
            // if (listTr) {
            //     console.log("listTr", listTr[0], listTr[1], listTr[2], listTr[3], listTr[4], listTr[5]);
            // }
            //lấy ra số điện thoại, có thể bao gồm với các ngoặc ><. dùng tr thứ 5
            // ["<tr>15000</tr>"]
            let numberSpecial = listTr && listTr[5] ? await getMiddleNumber(listTr[5]) : [info];
            //["> 15000 <"]
            //console.log("numberSpecial", numberSpecial[0]);
            //lấy ra number
            let number = await getNumberMoney(numberSpecial[0]); // ["15000"] : ["0"]
            console.log("phone", phone, "money", number[0]);
            //await socket.send(SOCKET_SETINTERVALED_PHONE, { info: arrayNumber[idx].info, index: idx, phone: data.phone });
            res(number[0]);

        } catch (e) {
            console.log("getNumberInfo error ", phone, e);
            rej(e);
        }
    });
}

let random = () => {
    let rd = Math.floor(Math.random() * 10);
    console.log("number random", rd);
    return rd;
}

const inJectGetPhone = async () => {
    try {
        let stringF = 'window.getPhone = async (phone) => {' +
            'console.log(phone);' +
            'async function action(){' +
            'function get(){' +
            'return new Promise((resolve,reject)=>{' +
            'try{' +
            'let first = document.querySelector("#ctl01 > div:nth-child(1)").getElementsByTagName("input");' +

            'let form = first[0].id + "=" + first[0].value + "&" + first[1].id + "=" + first[1].value + "&" + first[2].id + "=" + encodeURIComponent(first[2].value) + "&";' +


            'let second = document.querySelector("#ctl01 > div:nth-child(4)").getElementsByTagName("input");' +

            'form = form + second[0].id + "=" + encodeURIComponent(second[0].value) + "&ctl00%24MainContent%24msisdn="+phone+"&ctl00%24MainContent%24submit_button1=T%C3%ACm+ki%E1%BA%BFm";' +

            'let formData = new FormData();' +
            'formData.append("", form);' +
            'fetch("https://10.156.0.19/Account/Subs_info.aspx", {' +
            'method: "POST",' +
            'headers: {' +
            '"Content-Type": "application/x-www-form-urlencoded",' +
            '},' +
            'body: formData,' +
            '})' +
            '.then(response => { return response.text(); })' +
            '.then(data => {' +
            'resolve(data);' +
            '})' +
            '.catch((error) => {' +
            'console.log("fetch eror",error);' +
            'reject(error);' +
            '});' +

            '}catch (e) {' +
            'console.log("try catch above",e);' +
            'reject(e);' +
            '}' +
            '});' +
            '}' +
            'try {' +
            'let resultt = await get();' +
            'return resultt;' +
            '} catch (e) {' +
            'return null;' +
            '}' +
            '};' +

            'return await action()' +
            '}';

        await driver.evaluate(stringF);
    } catch (e) {
        console.log("inject getPhone error", e);
    }
}

const login = function (data) {
    console.log("login voi username va password", data.username, data.password);
    doLogin(data.username, data.password, socket, driver);
}

const getListPhone = async function (data) {
    //console.log("getListPhone", data);
    socket.send(SOCKET_LIST_PHONE, arrayNumber);
}

const findIndex = num => {
    let tempIndex = -1;
    arrayNumber.some((item, index) => {
        if (item.phone == num) {
            tempIndex = index;
            return true;
        }
    });
    return tempIndex; d
}

const duplicateNumber = num => {
    let bool = false;
    bool = arrayNumber.some((item) => {
        if (item.phone.trim() == num.trim())
            return true;
    });
    return bool;
}

//===========================================================================================================================================
//cái cũ dùng socket

const addNumber = async function (data) {

    //kiểm tra có bị trùng
    //ép kiểu về string
    data.phone = data.phone + "";
    let checkDuplicate = await duplicateNumber(data.phone);
    console.log("duplicate phone", data.phone, "is", checkDuplicate);
    if (checkDuplicate == false) {
        // console.log("verifyNumberPhone data.phone", verifyNumberPhone(data.phone));
        let tempPhone = await verifyNumberPhone(data.phone);
        data.phone = tempPhone[0];
        //console.log("data.phone", data.phone);
        arrayNumber.push(data);
        //console.log("arrayNumber push",arrayNumber);
        console.log("arrayNumber length", arrayNumber.length);
        //console.log("theem soos", arrayNumber[arrayNumber.length - 1]);
        let tempIndex = arrayNumber.length - 1; // 3
        console.log("tempIndex of phone", data.phone, "is", tempIndex)
        socket.send(SOCKET_WORKING_ADDED_NUMBER, { status: 200, data: data });
        await csvInstance.writeFile(arrayNumber);

        //gọi lại lần đầu
        let intertime = calculatorTime(tempIndex);

        setTimeout(async () => {
            try {
                data.info = await getNumberInfo(data.phone, data.info);
                console.log("server found that phone", data.phone, "with money", data.info, "index", tempIndex);
                await socket.send(SOCKET_SETINTERVALED_PHONE, { info: data.info, index: tempIndex, phone: data.phone });
            } catch (e) {
                await socket.send(SOCKET_SETINTERVALED_PHONE, { info: -1, index: tempIndex, phone: data.phone });
            }
        }, intertime - WAIT_TIME);

        arrayNumber[tempIndex].interval = setInterval(async () => { // xoa 3 >> clear interval 3
            //lúc thêm mới thì cần thận với cái arrayNumber.length này
            let idx = findIndex(data.phone);
            countInterval++;
            try {
                arrayNumber[idx].info = await getNumberInfo(arrayNumber[idx].phone, arrayNumber[idx].info);
                console.log("server found that phone", arrayNumber[idx].phone, "with money", arrayNumber[idx].info, "index", idx);
                await socket.send(SOCKET_SETINTERVALED_PHONE, { info: arrayNumber[idx].info, index: idx, phone: data.phone });
            } catch (e) {
                await socket.send(SOCKET_SETINTERVALED_PHONE, { info: -1, index: idx, phone: data.phone });
                console.log("add number error", e);
            }
        }, intertime);
    } else {
        socket.send(SOCKET_WORKING_ADDED_NUMBER, { status: "Số điện thoại đã tồn tại", data: null });
    }

}

//===========================================================================================================================================

const calculatorTime = (j) => {
    let checkArrray = [50, 100, 150, 200, 250, 300];
    let x = 0;
    checkArrray.some((item, index) => {
        if (j < item) {
            x = index;
            return true;
        }
    });
    return WAIT_TIME + j + x * 9000;
}

const addSomeNumber = function (data) {
    //console.log("theem nhieu soos", data);
    //kiểm tra có bị trùng
    arrayNumber.push(data);
    socket.send(SOCKET_WORKING_ADDED_SOME_NUMBER, data);
}

const deletePhone = function (data) {
    console.log("delete with phone and money", data);
    console.log("list number from server", arrayNumber);
    clearInterval(arrayNumber[data.index].interval);
    arrayNumber.splice(data.index, 1);
    csvInstance.writeFile(arrayNumber);
    socket.send(SOCKET_WORKING_DELETED_PHONE, { index: data.index });
}

const editPhone = function (data) {
    arrayNumber[data.index].phone = data.phone;
    arrayNumber[data.index].money = data.money;
    csvInstance.writeFile(arrayNumber);
    socket.send(SOCKET_WORKING_EDITED_PHONE, { index: data.index, phone: data.phone, money: data.money });
}


//hàm này chạy đầu tiên, nên hàm này sẽ inject hàm getPhone vào trang web, và khởi tạo một interval chuyên dọn dẹp các interval để giảm thiêu dung lượn cho trang web

const prepareInterval = async (data) => {

    //await removeIntervalForLightenWeb();

    await setIntervalPhone();

}

const removeIntervalForLightenWeb = async () => {
    console.log("removeIntervalForLightenWeb");
    //cứ 2 phút 1 lần sẽ xem có bao nhiêu interval  đang chạy, nếu nhiều quá, hơn 300 thì refresh lại trangm rồi injejct hàm getPhone lại
    clearIntervalMax = setInterval(async () => {
        console.log("countInterval", countInterval);
        if (countInterval > MAXIMUM_INTERVAL) {

            console.log("reset page");

            // tải lại trang
            await driver.goto(HOME_URL);

            // wait to complete
            await driver.waitForFunction('document.readyState === "complete"');

            countInterval = 0;

            await removeAllInterval();

            await setIntervalPhone();
        }
    }, WAIT_TIME * 2 + 15000); // sẽ là 2 phút 15 giây
}

//cái cũ dùng socket
//===================================================================================================================================
const setIntervalPhone = async function () {
    try {
        //inject hàm getPhone
        await inJectGetPhone();

        //await removeIntervalForLightenWeb();

        await socket.send(SOCKET_LOG, { message: "setIntervalPhone" });
        //console.log("data in server", arrayNumber);
        arrayNumber.forEach(async (item, index) => {
            //goi lan dau

            let intervalTime = calculatorTime(index);
            setTimeout(async () => {
                try {
                    item.info = await getNumberInfo(item.phone, item.info);
                    console.log("server found that phone", item.phone, "with money", item.info, "index", index);
                    await socket.send(SOCKET_SETINTERVALED_PHONE, { info: item.info, index: index, phone: item.phone });
                } catch (e) {
                    await socket.send(SOCKET_SETINTERVALED_PHONE, { info: -1, index: index, phone: item.phone });
                }
            }, intervalTime - WAIT_TIME);

            item.interval = setInterval(async () => {
                countInterval++;
                let idx = findIndex(item.phone);
                try {
                    item.info = await getNumberInfo(item.phone, item.info);
                    console.log("server found that phone", item.phone, "with money", item.info, "index", index);
                    await socket.send(SOCKET_SETINTERVALED_PHONE, { info: item.info, index: idx, phone: item.phone });
                } catch (e) {
                    await socket.send(SOCKET_SETINTERVALED_PHONE, { info: -1, index: idx, phone: item.phone });
                }
            }, intervalTime);
        });
    } catch (e) {
        console.log("setIntervalPhone", e);
        await socket.send(SOCKET_LOG, { message: "loi " + e });
    }
}

const removeAllInterval = async function (data) {
    try {

        arrayNumber.forEach(async (item, index) => {
            if (item.interval) {
                clearInterval(item.interval);
            }

        });
    } catch (e) {
        console.log("removeAllInterval", e);
    }
}

export default workingController;