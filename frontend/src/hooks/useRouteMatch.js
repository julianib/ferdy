import { matchPath, useLocation } from "react-router-dom";

// return any of the possible provided paths, if it matches current location
export default function useRouteMatch(patterns) {
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
