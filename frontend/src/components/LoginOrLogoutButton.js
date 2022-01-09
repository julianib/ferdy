import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import useProfile from "../hooks/useProfile";

export default function LoginOrLogoutButton() {
  const { profile } = useProfile();

  return <>{profile ? <LogoutButton /> : <LoginButton />}</>;
}
