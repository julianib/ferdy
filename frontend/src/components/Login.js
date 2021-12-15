import { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

export default function Login() {
  const CLIENT_ID =
    "179923541658-kfl4lp6lgd1nur0pk5vnqsb3d2hg49e6.apps.googleusercontent.com";
  const [user, setUser] = useState(null);

  async function onLoginSuccess(res) {
    console.log("login success", res);
    setUser(res.profileObj);

    fetch("http://localhost:1962", {
      method: "POST",
      body: JSON.stringify({ tokenId: res.tokenId }),
    })
      .then(res => res.json())
      .then(data => console.log(data))
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
            clientId={CLIENT_ID}
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
          clientId={CLIENT_ID}
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
