export default function CustomTabPanel({ current, index, children }) {
  // shorthand component for rendering a tabpanel WITHOUT react-router

  return current === index && children;
}
