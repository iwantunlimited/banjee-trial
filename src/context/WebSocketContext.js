// import React, { createContext, useContext } from 'react';

// export const WebSocketContext = createContext(null);

// export const WebSocketProvider = ({ children, socket }) => {
//   return (
//     <WebSocketContext.Provider value={socket}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();
const localToken = localStorage.getItem("token");
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://utb0hat9rd.execute-api.eu-central-1.amazonaws.com/dev");

    ws.onopen = async() => {
        ws.send(
        JSON.stringify({
          action: "auth",
          data: localToken,
        }))
        console.log("socket configured successfully" , socket);
        setSocket(ws);
      };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
