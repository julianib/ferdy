import { Outlet } from "react-router-dom";
import TabsPolls from "../components/TabsPolls";

export default function Polls() {
  return (
    <>
      <TabsPolls />
      <Outlet />
    </>
  );
}
