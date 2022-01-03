// shorthand function for making a tabpanel appear WITHOUT react-router
export default function CustomTabPanel({ current, index, children }) {
  return current === index && children;
}
