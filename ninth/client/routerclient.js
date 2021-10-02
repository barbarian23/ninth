import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./screen/home/home.screen";
import Login from "./screen/login/login.screen";
import Otp from "./screen/otp/otp.screen";
import { CLIENT_LOGIN, CLIENT_HOME,CLIENT_OTP } from "../common/constants/common.constants";

class MainRouter extends React.Component {
    render() {
        return (
            <div>
                <Route exact path={CLIENT_LOGIN} component={Login} /> 
                <Route path={CLIENT_HOME} component={Home} />
                <Route path={CLIENT_OTP} component ={Otp}/>
            </div>
        );
    }
}
export default MainRouter;