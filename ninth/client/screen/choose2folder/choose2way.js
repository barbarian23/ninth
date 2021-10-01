import '../../assets/css/home/home.css';
import { useHistory } from 'react-router-dom';

export default function Choose2Way() {
  let history = useHistory();

  function goto(name) {
    history.push(name); // goto("/home?page=1") || goto("/home?page=2")
  }

  return (
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
  );
}