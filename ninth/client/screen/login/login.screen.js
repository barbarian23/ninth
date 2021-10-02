import React, { useEffect } from "react";
import '../../assets/css/login/login.css';
import { useHistory } from 'react-router-dom';
import { loginConstant } from '../../constants/login/login.constant';
import { LOGIN } from "../../action/login/login.action";
import { useSelector, useDispatch } from 'react-redux';

export default function login(props) {

    let dispatch = useDispatch();

    let username = "";
    let password = "";

    let updateUsername = (e) => {
        username = e.target.value;
    }

    let updatePassword = (e) => {
        password = e.target.value;
    }

    let dispatchToStore = (action) => {
        dispatch(action);

    }

    let history = useHistory();
    let { isSomethingError, isLoginSuccess, loginError, logginin } = useSelector(state => state.login);

    useEffect(() => {
        // dieu huong sang otp
        console.log("is success", isLoginSuccess);
        if (isLoginSuccess) {
            history.push("/otp");
        }
    }, [isLoginSuccess]);

    return (
        <div>
            <div className="crawl-login" id="crawl_login">

                <div className="crawl-login-username-password">
                    <div className="crawl-login-username-password-upper">
                        <span>{loginConstant.loginName}</span>
                    </div>
                    <div className="crawl-login-username-password-below">
                        <input type="text" id="username" placeholder={loginConstant.loginNamePlaceholder} onChange={updateUsername} />
                    </div>
                </div>

                <div className="crawl-login-username-password">
                    <div className="crawl-login-username-password-upper">
                        <span>{loginConstant.loginPassword}</span>
                    </div>
                    <div className="crawl-login-username-password-below">
                        <input type="password" id="password" placeholder={loginConstant.loginPasswordPlaceholder} onChange={updatePassword} />
                    </div>
                </div>
                {
                    logginin == false ?
                        <div className="crawl-login-button-submit" id="crawl_login_button_submit"
                            onClick={() => dispatchToStore({ type: LOGIN, data: { username: username, password: password } })}>
                            <span>{loginConstant.loginButton}</span>
                        </div>
                        :
                        <div className="crawl-loading-parent" id="div_loginin_loading">
                            <div className="crawl-login-loading">
                                <div className="circle"></div>
                                <div className="circle"></div>
                                <div className="circle"></div>
                                <div className="shadow"></div>
                                <div className="shadow"></div>
                                <div className="shadow"></div>
                                <span>Đang đăng nhập ...</span>
                            </div>
                        </div>
                }
                {
                    isSomethingError == true ?
                        <div className="crawl-login-success-contain">
                            <h4 id="crawl_login_error_text">{loginError}</h4>
                        </div>
                        :
                        null
                }
            </div>
        </div >);

}