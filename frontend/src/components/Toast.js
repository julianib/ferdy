import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import useToast from "../hooks/useToast";

export default function Toast() {
  const { toast, closeToast } = useToast();

  function onClose(_event, reason) {
    if (reason !== "clickaway") {
      closeToast();
    }
  }

  return (
    <Snackbar open={toast.open} autoHideDuration={2000} onClose={onClose}>
      <Alert severity={toast.severity} onClose={onClose}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
