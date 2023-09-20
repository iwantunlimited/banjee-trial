let socket;
const localToken = localStorage.getItem("token");
export const initWebSocket = () => {
  socket = new WebSocket(
    "wss://utb0hat9rd.execute-api.eu-central-1.amazonaws.com/dev"
  );

  socket.onopen = async() => {
    socket.send(
    JSON.stringify({
      action: "auth",
      data: localToken,
    }))
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

  return socket;
};

