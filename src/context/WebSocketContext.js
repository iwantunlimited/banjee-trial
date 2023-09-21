import React, { createContext, useContext, useEffect } from 'react';
import { initWebSocket } from '../WebSocketConfig';

export const WebSocketContext = createContext({
	socketData: false,
	setSocketData: () => {},
});

export const WebSocketProvider = ({ children }) => {
  const {socketData} = useContext(WebSocketContext)

  const [data,setData] = React.useState(socketData);

  function handleData(data){
    setData(data)
  }

  return (
    <WebSocketContext.Provider value={{
      socketData: data,
      setSocketData: handleData     
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};
