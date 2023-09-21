// import React, { useEffect } from "react";
// import { WebSocketContext } from "../../context/WebSocketContext";

// export default function LiveAlerts() {
//   let socket = React.useContext(WebSocketContext) 

//   useEffect(() => {
//     console.log("Live Alerts",WebSocketContext);
//     if (socket) {
//       socket.addEventListener("message", (event) => {
//         console.log("Received message:", event.data);
//       });
//     }
//     console.log(socket);
//   }, [socket]);
//   return <div>LiveAlerts</div>;
// }

// LiveAlert.js
import React, { useEffect } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';

const LiveAlert = () => {
  const socket = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        // Handle incoming WebSocket messages here
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        // Update your component state or perform actions based on the message
      });
    }
  }, [socket]);

  return (
    <div>
        Live Alerts
    </div>
  );
};

export default LiveAlert;
