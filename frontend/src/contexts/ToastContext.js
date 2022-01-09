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

  function openToast(message, severity = "info") {
    // first close to reset autoHideDuration
    setToast({ ...toast, open: false });
    setToast({ open: true, message, severity });
  }

  return (
    <ToastContext.Provider value={{ toast, setToast, closeToast, openToast }}>
      {children}
    </ToastContext.Provider>
  );
}