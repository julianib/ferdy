import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export default function useToast() {
  const { toast, setToast, closeToast, openToast } = useContext(ToastContext);

  return { toast, setToast, closeToast, openToast };
}
