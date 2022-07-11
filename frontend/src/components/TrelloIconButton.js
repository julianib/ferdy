import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import IconButton from "@mui/material/IconButton";

export default function TrelloIconButton() {
  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={() => window.open("https://trello.com/b/O3OrtKIi/ferdy")}
    >
      <ViewKanbanOutlinedIcon />
    </IconButton>
  );
}
