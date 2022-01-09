import { Button } from "@mui/material";
import GoogleLogin from "react-google-login";
import usePacket from "../hooks/usePacket";
import useProfile from "../hooks/useProfile";
import useToast from "../hooks/useToast";
import sendPacket from "../utils/sendPacket";

const { REACT_APP_CLIENT_ID } = process.env;

export default function LoginButton() {
  const { setProfile } = useProfile();
  const { openToast } = useToast();

  function onGoogleLoginFailure(res) {
    console.debug("Google log in error, sending error", res);

    // notify backend of error
    sendPacket("user.log_in.google_error", res);
  }

  function onGoogleLoginSuccess(res) {
    // TODO login request again after socket lost connection

    console.debug("Google log in OK, sending token");
    sendPacket("user.log_in", {
      token_id: res.tokenId,
    });
  }

  usePacket("user.log_in.fail", (content) => {
    openToast(`Couldn't log in: ${content.error}`, "error");
  });

  usePacket("user.log_in.ok", (content) => {
    console.log("Log in OK");
    openToast(`Logged in as: ${content.profile.name}`, "success");
    setProfile(content.profile);
  });

  return (
    <GoogleLogin
      render={(renderProps) => (
        <Button
          variant="outlined"
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
        >
          Log in
        </Button>
      )}
      clientId={REACT_APP_CLIENT_ID}
      cookiePolicy="single_host_origin"
      buttonText="Sign In with Google"
      onSuccess={onGoogleLoginSuccess}
      onFailure={onGoogleLoginFailure}
      // isSignedIn
    />
  );
}
