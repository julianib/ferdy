import { Button } from "@mui/material";
import { GoogleLogout } from "react-google-login";
import usePacket from "../hooks/usePacket";
import useProfile from "../hooks/useProfile";
import useToast from "../hooks/useToast";
import sendPacket from "../utils/sendPacket";

const { REACT_APP_CLIENT_ID } = process.env;

export default function LogoutButton() {
  const { setProfile } = useProfile();
  const { openToast } = useToast();

  function onGoogleLogoutSuccess() {
    console.debug("google log out ok");
    sendPacket("user.log_out");
  }

  usePacket("user.log_out.fail", (content) => {
    openToast(`Couldn't log out: ${content.error}`, "error");
  });

  usePacket("user.log_out.ok", () => {
    console.log("Log out OK");
    openToast("Logged out", "success");
    setProfile(null);
  });

  return (
    <GoogleLogout
      render={(renderProps) => (
        <Button variant="outlined" onClick={renderProps.onClick}>
          Log out
        </Button>
      )}
      clientId={REACT_APP_CLIENT_ID}
      buttonText="Logout"
      onLogoutSuccess={onGoogleLogoutSuccess}
    />
  );
}
