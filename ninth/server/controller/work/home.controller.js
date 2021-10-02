import { HOME_URL } from "../../constants/work/work.constants";
import { SOCKET_WORKING_CRAWLED_ITEM_DATA, SOCKET_CRAWLED_DONE } from "../../../common/constants/common.constants";
import { getListTdInformation, getTdInformation } from "../../service/util/utils.server";
const DEFAULT_DELAY = 2000;

/**
 * 
 * @param {*} ms sleep đi 1 vài giây, đơn vị là milisecond
 */
function timer(ms) {
    ms = ms == null ? DEFAULT_DELAY : ms;
    return new Promise(res => setTimeout(res, ms));
}
//ghi ra từng ô trong excel
async function writeToXcell(worksheet, x, y, title, style) {
    try {
        worksheet.cell(x, y).string(title + "").style(style);
    } catch (e) {
        console.log("e", e);
    }
    // }
}
// do login
async function doGetInfomation(line, numberPhone, index, month, worksheet, socket, driver, length, style) {
    try {
        console.log("numberPhone ", numberPhone, "month", month);
        // go to login url
        await driver.goto(HOME_URL);

        let selector = "#txtSearch";
        await driver.$eval(selector, (el, value) => el.value = value, numberPhone);

        // select to password input & send password
        selector = "#month";
        await driver.$eval(selector, (el, value) => el.value = value, month);

        // select to button search & click button
        selector = "#Div_Param > div:nth-child(2) > div:nth-child(3) > button"; // need to update
        await Promise.all([driver.click(selector)]);//, driver.waitForNavigation({ waitUntil: 'load', timeout: 0 })]);

        await timer(2000);

        //lấy ra table result search - chỉ lấy phần row data
        let resultHtml = await driver.$$eval("#tbody_td_207", spanData => spanData.map((span) => {
            return span.innerHTML;
        }));

        console.log("dataFromTable is: ", resultHtml);

        if (JSON.stringify(resultHtml) == JSON.stringify([""])) { //  table k co du lieu >> k them vao excel
            // bo qua,k them du lieu vao excel
            socket.send(SOCKET_WORKING_CRAWLED_ITEM_DATA, { index: index + 1, phone: numberPhone });
            
        } else {
            //let listTdTag = getListTdInformation(resultHtml);
            let listTdTag = getListTdInformation(resultHtml[0]);
            console.log("index", index);
            // crawl BTS_NAME
            let btsName = getTdInformation(listTdTag[1]);
            // crawl MATINH - important
            let maTinh = getTdInformation(listTdTag[2]);
            // crawl TOTAL_TKC - optional
            let totalTKC = getTdInformation(listTdTag[3]);
            // thêm data vao excel
            writeToXcell(worksheet, line, 1, index, style); // STT
            writeToXcell(worksheet, line, 2, numberPhone, style); // SDT
            writeToXcell(worksheet, line, 3, btsName[0], style); // BTS_NAME
            writeToXcell(worksheet, line, 4, maTinh[0], style); // MA_TINH
            writeToXcell(worksheet, line, 5, totalTKC[0], style); // TOTAL_TKC
            // gửi dữ liệu về client
            // await socket.send(SOCKET_WORKING_CRAWLED_ITEM_DATA, { index:index, phone: numberPhone, btsName: btsName, maTinh: maTinh, totalTKC: totalTKC });
            socket.send(SOCKET_WORKING_CRAWLED_ITEM_DATA, { index: index, phone: numberPhone });
            // clearInterval(itemPhone.interval);
            line++;
        }
        //đưa đoạn gửi tín hiệu thành công ra khỏi if else
        // if (index == length) {
        //     socket.send(SOCKET_CRAWLED_DONE, { data: 2 });
        // }
        return line;
    } catch (e) {
        console.log("doGetInfomation error ", e);
    }
}
export default doGetInfomation;
