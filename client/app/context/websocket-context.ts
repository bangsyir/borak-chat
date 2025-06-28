import { createContext, useContext } from "react";

export const WebSocketContext = createContext<{
  send: (message: any) => void;
} | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebsocket must be used within a WebSocketProvider");
  }
  return context;
};
