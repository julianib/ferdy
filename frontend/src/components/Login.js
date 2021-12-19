import { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

import { sendPacket } from "../connection";

export default function Login() {
  const { REACT_APP_CLIENT_ID } = process.env;
  const [user, setUser] = useState(null);

  async function onLoginSuccess(res) {
    // TODO send json token again after socket lost connection
    console.debug("google login ok, verifying with backend", res);
    setUser(res.profileObj); // TODO should happen AFTER backend verify
    // fetchBackend("POST", res.tokenId);
    sendPacket("user.login.verify");
  }

  function onLoginFailure(res) {
    console.debug("google login error", res);
    sendPacket("user.login.error", res);
  }

  function onLogoutSuccess() {
    console.log("google logout ok");
    sendPacket("user.logout");
    setUser(null);
  }

  return (
    <>
      {user ? (
        <div>
          <h1>AAAA, {user.givenName}</h1>

          <GoogleLogout
            clientId={REACT_APP_CLIENT_ID}
            buttonText={"Logout"}
            onLogoutSuccess={onLogoutSuccess}
          >
            Log out
          </GoogleLogout>
        </div>
      ) : (
        <GoogleLogin
          clientId={REACT_APP_CLIENT_ID}
          cookiePolicy={"single_host_origin"}
          buttonText="Sign In with Google"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          isSignedIn
        >
          Log in
        </GoogleLogin>
      )}
    </>
  );
}
