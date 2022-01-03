import { useState } from "react";
import { usePacket } from "../hooks/usePacket";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function ConnectionToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  function openToast(message, severity) {
    setMessage(message);
    setOpen(true);
    setSeverity(severity);
  }

  function onClose(_event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  usePacket("connect", () => {
    console.debug("Connected");
    openToast("Connected", "success");
  });

  usePacket("disconnect", (reason) => {
    console.debug("Disconnected:", reason);
    openToast(`Disconnected: ${reason}`, "error");
  });

  usePacket("connect_error", (error) => {
    console.debug("Connect error:", error);
    openToast(`Couldn't connect: ${error}`, "error");
  });

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
