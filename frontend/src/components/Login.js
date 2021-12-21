import { useContext, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { UserContext } from "../contexts/UserContext";
import usePacket from "../hooks/usePacket";
import sendPacket from "../util/sendPacket";

const { REACT_APP_CLIENT_ID } = process.env;

export default function Login() {
  // const { user, setUser } = useUser(); // wtfffff broken
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    console.debug("useEffect Login", user);
  }, [user]);

  usePacket("user.log_in.error", (content) => {
    console.error("Log in failed, clear user state:", content.error);
    setUser(null);
  });

  usePacket("user.log_in.ok", (content) => {
    console.log("Log in OK");
    setUser({ ...content });
  });

  usePacket("user.log_out.error", (content) => {
    console.error("Log out error, clearing user state:", content.error);
    setUser(null);
  });

  usePacket("user.log_out.ok", () => {
    console.log("Log out OK");
    setUser(null);
  });

  function onGoogleLoginOk(res) {
    // TODO login request again after socket lost connection
    console.debug("google log in ok, asking verification", res);
    sendPacket("user.log_in", {
      google_id: parseInt(res.profileObj.googleId),
      name: res.profileObj.name,
    });
  }

  function onGoogleLoginError(res) {
    console.debug("google log in error, reporting error", res);

    // notify backend of error
    sendPacket("user.log_in.google_error", res);
  }

  function onGoogleLogoutOk() {
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
          onLogoutSuccess={onGoogleLogoutOk}
        >
          Log out
        </GoogleLogout>
      ) : (
        <GoogleLogin
          clientId={REACT_APP_CLIENT_ID}
          cookiePolicy="single_host_origin"
          buttonText="Sign In with Google"
          onSuccess={onGoogleLoginOk}
          onFailure={onGoogleLoginError}
          isSignedIn
        >
          Log in
        </GoogleLogin>
      )}
      {user?.name || "no user set"}
    </>
  );
}
