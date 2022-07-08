import { useContext } from "react";
import { OnlineUsersContext } from "../contexts/OnlineUsersContext";

// todo update loggedinusercount when people log in
export default function useOnlineUsers() {
  const {
    onlineProfiles,
    setOnlineProfiles,
    loggedInUserCount,
    setLoggedInUserCount,
    userCount,
    setUserCount,
  } = useContext(OnlineUsersContext);

  return {
    onlineProfiles,
    setOnlineProfiles,
    loggedInUserCount,
    setLoggedInUserCount,
    userCount,
    setUserCount,
  };
}
