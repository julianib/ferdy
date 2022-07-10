import { createContext, useState } from "react";

export const ToastContext = createContext();

export function ToastContextProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  function closeToast() {
    setToast({ ...toast, open: false });
  }

  // todo add multiple toasts popup (use array of messages)
  function openToast(message, severity = "info", duration = 2500) {
    // first set open to false to reset autoHideDuration
    setToast({ ...toast, open: false, duration: 0 });
    setToast({ open: true, message, severity, duration });
  }

  return (
    <ToastContext.Provider value={{ toast, setToast, closeToast, openToast }}>
      {children}
    </ToastContext.Provider>
  );
}
