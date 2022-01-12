import { useLocation } from "react-router-dom";

// get the value for Tabs by getting pathname segment at a specific index
export default function useTabsValue(index) {
  const { pathname } = useLocation();
  const split = pathname
    .substring(1)
    .split("/")
    .map((segment) => `/${segment}`);
  const indexedValue = split[index];

  if (!indexedValue) {
    // if no trailing / in url the value is undefined, so return "/" instead
    return "/";
  }

  return indexedValue;
}
