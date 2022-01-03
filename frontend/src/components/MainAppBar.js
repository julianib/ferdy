export default function MainAppBar() {
  return (
    <AppBar
      enableColorOnDark
      sx={{
        // removes the mui brightening background image gradient
        backgroundImage: "none",
      }}
    >
      <Container>
        <Toolbar>
          <Typography>Ferdy</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
