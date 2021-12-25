import { usePacket } from "../hooks/usePacket";
import sendPacket from "../util/sendPacket";
import useUser from "../hooks/useUser";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

export default function Login() {
  const { user, setUser } = useUser();

  usePacket("user.log_in.error", (content) => {
    console.error("Log in failed, clearing user state:", content.error);
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
      token_id: res.tokenId,
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
        <LogoutButton onGoogleLogoutOk={onGoogleLogoutOk} />
      ) : (
        <LoginButton
          onGoogleLoginOk={onGoogleLoginOk}
          onGoogleLoginError={onGoogleLoginError}
        />
      )}
    </>
  );
}
