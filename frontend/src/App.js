import Login from "./components/Login";
import ChatBox from "./components/ChatBox";
import useUser from "./hooks/useUser";
import Avatar from "./components/Avatar";

/*
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const themeOptions: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#ff7e00',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff3800',
    },
    background: {
      default: '#282828',
    },
    error: {
      main: '#ff0000',
    },
  },
};
 */

export default function App() {
  const { user } = useUser();

  return (
    <>
      {user ? <Avatar user={user} showName /> : <h1>Not logged in</h1>}
      <br />
      <Login />
      <ChatBox />
    </>
  );
}
