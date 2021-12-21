import { useContext, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { sendPacket, usePacket } from "../backend";

import { UserContext } from "../contexts/UserContext";

export default function Login() {
  const { REACT_APP_CLIENT_ID } = process.env;
  const { user, setUser } = useContext(UserContext);

  usePacket("user.log_in.error", (content) => {
    console.error("Log in failed, clear user state,", content.reason);
    setUser(null);
  });

  usePacket("user.log_in.ok", (content) => {
    console.log("Log in OK");
    setUser({ ...content }); // TODO check what data we want to give the user
  });

  usePacket("user.log_out.error", (content) => {
    console.error("Log out error, clearing user state", content.error);
    setUser(null);
  });

  usePacket("user.log_out.ok", () => {
    console.log("Log out OK");
    setUser(null);
  });

  useEffect(() => {});

  async function onLoginSuccess(res) {
    // TODO login request again after socket lost connection
    console.debug("google log in ok, asking verification", res);
    sendPacket("user.log_in", {
      google_id: parseInt(res.profileObj.googleId),
      name: res.profileObj.name,
    });
  }

  function onLoginFailure(res) {
    console.debug("google log in error, reporting error", res);

    // notify backend of error
    sendPacket("user.log_in.google_error", res);
  }

  function onLogoutSuccess() {
    console.debug("google log out ok");
    sendPacket("user.log_out");
  }

  // TODO add normal email and password field in case google button doesnt work

  return (
    <>
      {user ? (
        <GoogleLogout
          clientId={REACT_APP_CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={onLogoutSuccess}
        >
          Log out
        </GoogleLogout>
      ) : (
        <GoogleLogin
          clientId={REACT_APP_CLIENT_ID}
          cookiePolicy="single_host_origin"
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
