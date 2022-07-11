import Button from "@mui/material/Button";
import { GoogleLogout } from "react-google-login";
import sendPacket from "../utils/sendPacket";

const { REACT_APP_CLIENT_ID } = process.env;

export default function LogoutButton() {
  function onGoogleLogoutSuccess() {
    console.debug("google log out ok");
    sendPacket("user.log_out", null, true);
  }

  return (
    <GoogleLogout
      render={(renderProps) => (
        <Button
          sx={{ display: "block" }}
          variant="outlined"
          onClick={renderProps.onClick}
        >
          Log out
        </Button>
      )}
      clientId={REACT_APP_CLIENT_ID}
      buttonText="Logout"
      onLogoutSuccess={onGoogleLogoutSuccess}
    />
  );
}
