import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function useUser() {
  const { user, setUser } = useContext(UserContext);

  return { user, setUser };
}
