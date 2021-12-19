import { createContext, useState } from "react";

const SocketContext = createContext();

function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContext, SocketContextProvider };
