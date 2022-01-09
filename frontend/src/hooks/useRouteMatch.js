import { matchPath, useLocation } from "react-router-dom";

export default function useRouteMatch(patterns) {
  // return any of the possible provided paths, if it matches current location
  // the order should be ['users/add', 'users/edit', 'users'].

  // src https://v5.reactrouter.com/web/api/location
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];

    // src https://v5.reactrouter.com/web/api/matchPath
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      // only return "/path"
      return possibleMatch.pattern.path;
    }
  }

  // no match
  return null;
}
