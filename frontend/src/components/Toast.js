import { Alert, Snackbar } from "@mui/material";
import useToast from "../hooks/useToast";

export default function Toast() {
  const { toast, closeToast } = useToast();

  function onClose(_event, reason) {
    if (reason !== "clickaway") {
      closeToast();
    }
  }

  return (
    <>
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={onClose}
      >
        <Alert severity={toast.severity} onClose={onClose}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
