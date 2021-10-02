import { combineReducers } from 'redux';
import homeReducer from "./home/home.reducer";
import loginReducer from "./login/login.reducer";
import otpReducer from './otp/otp.reducer';

const rootReducer = combineReducers({
    login: loginReducer,
    home: homeReducer,
    otp: otpReducer,
});

export default rootReducer;