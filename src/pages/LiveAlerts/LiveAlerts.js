import React, { useEffect } from "react";
import { WebSocketContext, useWebSocket } from "../../context/WebSocketContext";

export default function LiveAlerts() {
  let socket = React.useContext(WebSocketContext) 
//   useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", (event) => {
        console.log("Received message:", event.data);
      });
      console.log(socket);
    }
  }, [socket]);
  return <div>LiveAlerts</div>;
}
