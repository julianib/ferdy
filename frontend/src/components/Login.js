import { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

import { REACT_APP_BACKEND_URL } from "../connection";

export default function Login() {
  const { REACT_APP_CLIENT_ID } = process.env;
  const [user, setUser] = useState(null);

  async function onLoginSuccess(res) {
    // TODO send json token again after socket lost connection for some reason
    console.log("login success", res);
    setUser(res.profileObj);
    let tokenId = res.tokenId;

    fetch(REACT_APP_BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((ex) => {
        console.log(ex);
      });

    console.log("sent fetch");
  }

  function onLoginFailure(res) {
    console.log("Login unsuccessful", res);
  }

  function onLogoutSuccess() {
    console.log("Logout success");
    setUser(null);
  }

  return (
    <>
      {user ? (
        <div>
          <h1>Welcome, {user.givenName}</h1>

          <GoogleLogout
            clientId={REACT_APP_CLIENT_ID}
            buttonText={"Logout"}
            onLogoutSuccess={onLogoutSuccess}
            render={(button) => (
              <button onClick={button.onClick} disabled={button.disabled}>
                Log out
              </button>
            )}
          ></GoogleLogout>
        </div>
      ) : (
        <GoogleLogin
          clientId={REACT_APP_CLIENT_ID}
          buttonText="Sign In with Google"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
          render={(button) => (
            <button onClick={button.onClick} disabled={button.disabled}>
              Log in
            </button>
          )}
        />
      )}
    </>
  );
}
