import { useState } from "react";
import usePacket from "../hooks/usePacket";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function Toast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  function openToast(message, severity = "info") {
    // first close to reset autoHideDuration
    setOpen(false);

    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }

  function onClose(_event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  usePacket("connect", () => {
    console.debug("Connected");
    openToast("Connected");
  });

  usePacket("connect_error", (error) => {
    openToast(`Couldn't connect: ${error.message}`, "error");
  });

  usePacket("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    openToast(`Disconnected: ${reason}`);
  });

  usePacket("error", (content) => {
    openToast(`Error: ${content.error}`, "error");
  });

  usePacket("role.create.fail", (content) => {
    openToast(`Couldn't create role: ${content.error}`, "error");
  });

  usePacket("role.create.ok", (content) => {
    openToast(`Created role: ${content.role.name}`, "success");
  });

  usePacket("role.delete.fail", (content) => {
    openToast(`Couldn't delete role: ${content.error}`, "error");
  });

  usePacket("role.delete.ok", (content) => {
    openToast(`Deleted role: ${content.role.name}`, "success");
  });

  usePacket("user.log_in.fail", (content) => {
    openToast(`Couldn't log in: ${content.error}`, "error");
  });

  usePacket("user.log_in.ok", (content) => {
    openToast(`Logged in as: ${content.profile.name}`, "success");
  });

  usePacket("user.log_out.fail", (content) => {
    openToast(`Couldn't log out: ${content.error}`, "error");
  });

  usePacket("user.log_out.ok", () => {
    openToast("Logged out", "success");
  });

  usePacket("user.send_message.fail", (content) => {
    openToast(`Couldn't send message: ${content.error}`, "error");
  });

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
