import { useContext } from "react";
import { OnlineUsersContext } from "../contexts/OnlineUsersContext";

export default function useOnlineUsers() {
  const {
    onlineProfiles,
    setOnlineProfiles,
    loggedInUsersCount,
    setLoggedInUserCount,
    userCount,
    setUserCount,
  } = useContext(OnlineUsersContext);

  return {
    onlineProfiles,
    setOnlineProfiles,
    loggedInUsersCount,
    setLoggedInUserCount,
    userCount,
    setUserCount,
  };
}
