import { BACKEND } from "../util/backend";

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
        src={`${BACKEND}/files/avatars/default.png`}
        alt=""
      />
      <span style={classes.author}>{author}</span>
      <span style={classes.text}>{text}</span>
    </li>
  );
}
