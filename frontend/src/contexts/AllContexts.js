import { MessagesContextProvider } from "./MessagesContext";
import { UserContextProvider } from "./UserContext";

export function AllContextProviders({ children }) {
  return (
    <MessagesContextProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </MessagesContextProvider>
  );
}
