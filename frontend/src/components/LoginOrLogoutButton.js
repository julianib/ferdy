import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import useProfile from "../hooks/useProfile";
import usePacket from "../hooks/usePacket";
import useToast from "../hooks/useToast";

export default function LoginOrLogoutButton() {
  const { profile } = useProfile();
  const { openToast } = useToast();
  const { setProfile } = useProfile();

  usePacket("user.log_in.error", (content) => {
    openToast(`Couldn't log in: ${content.error}`, "error");
  });

  usePacket("user.log_in.ok", (content) => {
    console.log("Log in OK");
    openToast(`Logged in as: ${content.profile.name}`, "success");
    setProfile(content.profile);
  });

  usePacket("user.log_out.error", (content) => {
    openToast(`Couldn't log out: ${content.error}`, "error");
  });

  usePacket("user.log_out.ok", () => {
    console.log("Log out OK");
    openToast("Logged out", "success");
    setProfile(null);
  });

  return <>{profile ? <LogoutButton /> : <LoginButton />}</>;
}
