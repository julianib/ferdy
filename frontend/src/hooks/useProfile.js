import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";

export default function useProfile() {
  const { profile, setProfile } = useContext(ProfileContext);

  return { profile, setProfile };
}
