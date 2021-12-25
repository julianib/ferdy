import { GoogleLogout } from "react-google-login";

const { REACT_APP_CLIENT_ID } = process.env;

export default function LogoutButton({ onGoogleLogoutOk }) {
  return (
    <GoogleLogout
      clientId={REACT_APP_CLIENT_ID}
      buttonText="Logout"
      onLogoutSuccess={onGoogleLogoutOk}
    >
      Log out
    </GoogleLogout>
  );
}
