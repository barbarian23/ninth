import { LOGIN_URL, OTP_URL } from "../../constants/work/work.constants";
import { SOCKET_SOMETHING_ERROR, SOCKET_LOGIN_INCORRECT, SOCKET_LOGIN_STATUS, SOCKET_LOGIN_GO_HOME  } from "../../../common/constants/common.constants";

const DEFAULT_DELAY = 2000;

/**
 * 
 * @param {*} ms sleep đi 1 vài giây, đơn vị là milisecond
 */
function timer(ms) {
    ms = ms == null ? DEFAULT_DELAY : ms;
    return new Promise(res => setTimeout(res, ms));
}

// do login
async function doLogin(username, password, socket, driver, driver2) {
    try {
        console.log("username ", username, "password", password);
        // go to login url
        await driver.goto(LOGIN_URL);

        // wait to complete
        // await driver.waitForFunction('document.readyState === "complete"'); // need open comment

        // select to username input & send username
        // let selector = "body #ctl01 .page .main .accountInfo #MainContent_LoginUser_UserName"; // need open comment
        let selector = "#txtUsername";
        await driver.$eval(selector, (el, value) => el.value = value, username);

        // select to password input & send password
        // selector = "body #ctl01 .page .main .accountInfo #MainContent_LoginUser_Password";// need open comment
        selector = "#txtPassword";
        await driver.$eval(selector, (el, value) => el.value = value, password);

        // select to button login & click button
        // selector = "body #ctl01 .page .main .accountInfo #MainContent_LoginUser_LoginButton";// need open comment
        selector = "#btnLogin";
        await Promise.all([driver.click(selector), driver.waitForNavigation({ timeout: '61000' })]);

        //await timer(2000);

        //lấy ra một DOM - tương đương hàm document.querySelector()
        // let dataFromLoginSummarySpan = await driver.$$eval("body #ctl01 .page .main .failureNotification", spanData => spanData.map((span) => {
        //     return span.innerHTML;
        // }));

        // if (dataFromLoginSummarySpan.length > 0) {
        //     socket.send(SOCKET_LOGIN_INCORRECT, { data: -1 });
        //     return;
        // }

        //nếu là tài khoản không cần otp, sẽ tự điều hướng tới trang home
        await driver.waitForFunction('document.readyState === "complete"');

        let otpDOM = await driver.$$eval("#txtOtp", spanData => spanData.map((span) => {
            return span.innerHTML;
        }));

        let homeDOM = await driver.$$eval("#mainmenu", spanData => spanData.map((span) => {
            return span.innerHTML;
        }));

        while (otpDOM.length == 0 && homeDOM.length == 0) {
            otpDOM = await driver.$$eval("#txtOtp", spanData => spanData.map((span) => {
                return span.innerHTML;
            }));

            homeDOM = await driver.$$eval("#mainmenu", spanData => spanData.map((span) => {
                return span.innerHTML;
            }));
            await timer(500);
        }

        console.log("otpDOM", otpDOM.lenght);
        console.log("homeDOM", homeDOM.lenght);

        if (otpDOM.length > 0) {//otp
            socket.send(SOCKET_LOGIN_STATUS, { data: 1 });
        } else if (homeDOM.length > 0) {//home
            socket.send(SOCKET_LOGIN_GO_HOME, { data: 3 });
        }

    } catch (e) {
        console.log("Login Error", e);
        socket.send(SOCKET_LOGIN_INCORRECT, { data: -1 });
        socket.send(SOCKET_SOMETHING_ERROR, { data: 0 });
    }
}
export default doLogin;
