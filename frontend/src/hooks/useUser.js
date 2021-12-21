import { useState } from "react";

export default function useUser() {
  const [user, setUser] = useState({
    name: "initial name",
    first_name: "initial first_name",
  });

  return { user, setUser };
}
