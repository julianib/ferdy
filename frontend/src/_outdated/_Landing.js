import "./Landing.css";

const classes = {
  container: {
    margin: "auto",
    textAlign: "center",
  },
};

export default function Landing() {
  return (
    <div style={classes.container}>
      <img id="logo" src="logo-400-orange-trans.png" alt="" />
      <h1>Greg for life</h1>
    </div>
  );
}
