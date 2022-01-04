import usePacket from "../hooks/usePacket";
import sendPacket from "../utils/sendPacket";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";

export default function LoginOrLogoutButton() {
  const { profile, setProfile } = useContext(ProfileContext);

  usePacket("user.log_in.error", (content) => {
    console.error("Log in failed, clearing user state:", content.error);
    setProfile(null);
  });

  usePacket("user.log_in.ok", () => {
    console.log("Log in OK");
  });

  usePacket("user.log_out.error", (content) => {
    console.error("Log out error, clearing user state:", content.error);
    setProfile(null);
  });

  usePacket("user.log_out.ok", () => {
    console.log("Log out OK");
  });

  function onGoogleLoginOk(res) {
    // TODO login request again after socket lost connection

    console.debug("Google log in OK, sending token");
    sendPacket("user.log_in", {
      token_id: res.tokenId,
    });
  }

  function onGoogleLoginError(res) {
    console.debug("Google log in error, sending error", res);

    // notify backend of error
    sendPacket("user.log_in.google_error", res);
  }

  function onGoogleLogoutOk() {
    console.debug("google log out ok");
    sendPacket("user.log_out");
  }

  return (
    <>
      {profile ? (
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
