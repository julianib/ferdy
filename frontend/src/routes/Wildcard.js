import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function Wildcard() {
  const navigate = useNavigate();

  function onClick() {
    navigate("/");
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Button variant="outlined" size="large" display="block" onClick={onClick}>
        404!
      </Button>
    </Box>
  );
}
