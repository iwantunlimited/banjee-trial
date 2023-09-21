import React from "react";
import { WebSocketContext } from "./context/WebSocketContext";

export const SocketConfiguration = () => {
  const {setSocketData} = React.useContext(WebSocketContext)
  React.useEffect(() => {
  const localToken = localStorage.getItem("token");
  let socket = new WebSocket(
    "wss://utb0hat9rd.execute-api.eu-central-1.amazonaws.com/dev"
  );
    
  socket.onopen = () => {
    
    socket.send(
    JSON.stringify({
      action: "auth",
      data: localToken,
    }))
    setSocketData(socket)
    console.log("socket configured successfully" , socket);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error.message);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(
        `WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`
      );
    } else {
      console.error("WebSocket connection died");
    }
  };
  },[])

  return null;
};

