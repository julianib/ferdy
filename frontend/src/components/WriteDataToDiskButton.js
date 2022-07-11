import IconButton from "@mui/material/IconButton";
import sendPacket from "../utils/sendPacket";
import SaveIcon from "@mui/icons-material/Save";

export default function WriteDataToDiskButton() {
  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={() => sendPacket("database.write")}
    >
      <SaveIcon />
    </IconButton>
  );
}
