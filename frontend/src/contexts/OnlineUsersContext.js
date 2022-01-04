import { createContext, useState } from "react";

export const OnlineUsersContext = createContext();

export function OnlineUsersContextProvider({ children }) {
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [loggedInUserCount, setLoggedInUserCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  return (
    <OnlineUsersContext.Provider
      value={{
        loggedInUsers,
        setLoggedInUsers,
        loggedInUserCount,
        setLoggedInUserCount,
        userCount,
        setUserCount,
      }}
    >
      {children}
    </OnlineUsersContext.Provider>
  );
}
