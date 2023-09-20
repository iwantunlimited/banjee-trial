import React, { createContext, useContext } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, socket }) => {
  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};