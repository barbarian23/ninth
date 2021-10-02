import { takeLatest, take, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import socketClient from "../../service/socket/socket.client.service";
import { MAIN_URL, SOCKET_OTP, SOCKET_OTP_INCORRECT, SOCKET_OTP_STATUS, SOCKET_SOMETHING_ERROR } from '../../../common/constants/common.constants';
import { OTP_CHECKING, OPEN_HOME_SCREEN, IS_OTP_VERIFYING, OTP_STATUS } from '../../action/otp/otp.action';

// connect to server
const socket = new socketClient(MAIN_URL);

const otpSocket = function (data) {
    console.log("otpSocket", data);
    return eventChannel(emitter => {
        //gửi
        console.log("otp send to server, ", data.data.otpchecking);
        socket.send(SOCKET_OTP, { otp: data.data.otpchecking });

        // nhan
        socket.receive(SOCKET_OTP_INCORRECT, data => {
            console.log("from server", data);
            emitter(data);
        });
        //nhận
        socket.receive(SOCKET_OTP_STATUS, data => {
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

const otpChecking = function* (data) {
    // yield put({ type: OTP_CHECKING, value: true });

    // goi ham lang nghe socket
    let result = yield call(otpSocket, data);
    yield put({
        type: IS_OTP_VERIFYING,
        value: true
    })
    //chueyrn status về riingx
    yield put({
        type: OTP_STATUS,
        value: ""
    })

    // ket qua cua socket
    while (true) {
        let responce = yield take(result);

        if (responce) {
            console.log("responce", responce);
            //không cần biết kết quả otp được xác thực là thành công hay thất bại, sẽ chuyển thành false, để hiện lại nút otp
            yield put({
                type: IS_OTP_VERIFYING,
                value: false
            })
            if (responce.data == 1) {
                yield put({
                    type: OPEN_HOME_SCREEN
                })
            } else if (responce.data == -1) { // lỗi mạng
                yield put({
                    type: OTP_STATUS,
                    value: "Lỗi mạng, vui lòng kiểm tra lại kết nối và mở lại phần mềm"
                })
            } else if (responce.data == 3) { //otp timeout
                yield put({
                    type: OTP_STATUS,
                    value: "OTP đã hết hạn, vui lòng  đăng nhập lại ..."
                })
                yield put({
                    type: OTP_TIMEOUT,
                    value: true
                })
            } else if (responce.data == 4) { //otp sai
                yield put({
                    type: OTP_STATUS,
                    value: "Nhập sai OTP, vui lòng thử lại"
                })
            }
            //yield put({ type: OTP_CHECKING, value: false });
        }
    }
}

export const watchOtp = function* () {
    yield takeLatest(OTP_CHECKING, otpChecking);
}