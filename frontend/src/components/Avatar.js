import { BACKEND } from "../util/backend";

// const classes = {
//   avatar: {},
// };

export default function Avatar({ user, showName }) {
  let avatar_url;
  if (user.avatar_external) {
    avatar_url = user.avatar_url;
  } else {
    avatar_url = `${BACKEND}/${user.avatar_url}`;
  }

  return (
    <span>
      <img
        src={avatar_url}
        alt=""
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
        }}
      />
      {showName && user.name}
    </span>
  );
}
