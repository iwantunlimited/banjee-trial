import React, { useEffect } from "react";
import { WebSocketContext } from "../../context/WebSocketContext";

export default function LiveAlerts() {
  let socket = React.useContext(WebSocketContext) 

  useEffect(() => {
    console.log("Live Alerts",WebSocketContext);
    if (socket) {
      socket.addEventListener("message", (event) => {
        console.log("Received message:", event.data);
      });
    }
    console.log(socket);
  }, [socket]);
  return <div>LiveAlerts</div>;
}
