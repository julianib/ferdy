import { BACKEND } from "../utils/backend";

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
  // todo outdated

  return (
    <li style={classes.container}>
      {
        // only show the avatar & author if message contains it
        author && (
          <>
            <img
              style={classes.avatar}
              src={`${BACKEND}/files/avatars/default.png`}
              alt=""
            />
            <span style={classes.author}>{author}</span>
          </>
        )
      }
      <span style={classes.text}>{text}</span>
    </li>
  );
}
