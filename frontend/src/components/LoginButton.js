import GoogleLogin from "react-google-login";

const { REACT_APP_CLIENT_ID } = process.env;

export default function LoginButton({ onGoogleLoginOk, onGoogleLoginError }) {
  return (
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
  );
}
