import { Outlet } from "react-router-dom";
import ProfilesTabs from "../components/TabsProfiles";

export default function Profiles() {
  return (
    <>
      <ProfilesTabs />
      <Outlet />
    </>
  );
}
