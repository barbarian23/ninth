import { takeLatest, take, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { LOGIN, OPEN_OTP_SCREEN, LOGIN_ERROR, LOGGINGIN } from "../../action/login/login.action";
import { LOGIN_STATUS_TEXT } from "../../constants/login/login.constant";
import { loginConstant } from "../../constants/login/login.constant";
import socketClient from "../../service/socket/socket.client.service";
import { SOCKET_LOGIN, MAIN_URL, SOCKET_LOGIN_INCORRECT, SOCKET_LOGIN_STATUS, SOCKET_SOMETHING_ERROR } from "../../../common/constants/common.constants";

// connect to server
const socket = new socketClient(MAIN_URL);

const loginSocket = function (data) {
    console.log("loginSocket", data);
    return eventChannel(emitter => {
        //gửi
        socket.send(SOCKET_LOGIN, { username: data.data.username, password: data.data.password });

        // nhan
        socket.receive(SOCKET_LOGIN_INCORRECT, data => {
            console.log("from server", data);
            emitter(data);
        });
        //nhận
        socket.receive(SOCKET_LOGIN_STATUS, data => {
            console.log("from server", data);
            emitter(data);
        });

        //nhận
        socket.receive(SOCKET_SOMETHING_ERROR, data => {
            console.log("from server", data);
            emitter(data);
        });

        return () => {
            //unscrible
        };
    });
}

const login = function* (data) {
    yield put({ type: LOGGINGIN, value: true });

    //gọi hàm lắng nghe socket
    let result = yield call(loginSocket, data);

    //kết quả của socket
    while (true) {
        let responce = yield take(result);

        if (responce) {
            console.log("responce", responce);
            if (responce.data == 1) {
                yield put({
                    type: OPEN_OTP_SCREEN
                })
            } else if (responce.data == -1) {
                yield put({
                    type: LOGIN_ERROR,
                    value: "Đăng nhập lỗi, hãy thử lại"
                })
            }
            yield put({ type: LOGGINGIN, value: false });
        }
    }
}

const loginStatus = function* (data) {
    yield put({ type: LOGIN_STATUS_TEXT, value: loginConstant.loginSuccess });
}

//watcher
export const watchLogin = function* () {
    yield takeLatest(LOGIN, login);
}