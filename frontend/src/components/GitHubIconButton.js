import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";

export default function GitHubIconButton() {
  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={() => window.open("https://github.com/julianib/ferdy")}
    >
      <GitHubIcon />
    </IconButton>
  );
}
