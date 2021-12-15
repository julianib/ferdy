import { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

export default function Login() {
  const CLIENT_ID =
    "179923541658-kfl4lp6lgd1nur0pk5vnqsb3d2hg49e6.apps.googleusercontent.com";
  const [user, setUser] = useState(null);

  async function onSuccess(res) {
    setUser(res.profileObj);

    fetch("http://localhost:1962", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: res.tokenId }),
    });
  }

  function onFaliure(res) {
    console.log("Login unsuccessful", res);
  }

  function logout() {
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
            onLogoutSuccess={logout}
          ></GoogleLogout>
        </div>
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Sign In with Google"
          onSuccess={onSuccess}
          onFailure={onFaliure}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
        />
      )}
    </>
  );
}
