import { OPEN_HOME_SCREEN, OTP_CHECKING, IS_OTP_VERIFYING, OTP_TIMEOUT, OTP_STATUS } from "../../action/otp/otp.action";

const initialState = {
    isOtpSuccess: false,
    isSomethingError: false,
    otpError: "",
    otp_code: "",
    otpCheking: "",
    isVerifyingOTP: false,
    otpStatus: "",
    isTimeout: false,
};

export default function otpReducer(state = initialState, action) {
    switch (action.type) {
        case OPEN_HOME_SCREEN:
            return {
                ...state,
                isOtpSuccess: true
            }
        case IS_OTP_VERIFYING:
            return {
                ...state,
                isVerifyingOTP: action.value
            }
        case OTP_CHECKING:
            console.log("otp checking from client", action.data);
            return {
                ...state,
                otpCheking: action.data.otpcheking,
            }
        case OTP_STATUS:
            return {
                ...state,
                otpStatus: action.value
            }
        case OTP_TIMEOUT:
            return {
                ...state,
                isTimeout: action.value
            }
        default:
            return {
                ...state
            }
    }
}