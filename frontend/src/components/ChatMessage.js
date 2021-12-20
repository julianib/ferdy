const { REACT_APP_BACKEND_URL } = process.env;

const classes = {
  container: {},
  avatar: {},
  author: {
    margin: 10,
    fontWeight: "bold",
  },
  text: {},
};

export default function ChatMessage({ author, text }) {
  return (
    <li style={classes.container}>
      <img
        style={classes.avatar}
        src={`${REACT_APP_BACKEND_URL}/files/avatars/default.png`}
        alt="alt"
      />
      <span style={classes.author}>{author}</span>
      <span style={classes.text}>{text}</span>
    </li>
  );
}
