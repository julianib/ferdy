import Button from "@mui/material/Button";
import GoogleLogin from "react-google-login";
import sendPacket from "../utils/sendPacket";

const { REACT_APP_CLIENT_ID } = process.env;

export default function LoginButton() {
  function onGoogleLoginFailure(res) {
    console.debug("Google log in error, sending error", res);

    // notify backend of error
    sendPacket("user.log_in.google_error", res, true);
  }

  function onGoogleLoginSuccess(res) {
    console.debug("Google log in OK, sending JWT");
    sendPacket(
      "user.log_in",
      {
        fake: false,
        jwt: res.tokenId,
      },
      true
    );
  }

  return (
    <GoogleLogin
      render={(renderProps) => (
        <Button
          sx={{ display: "block" }}
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
      isSignedIn // auto sign in on page refresh
    />
  );
}
