import { AnyWebSocket, WebSocketData } from "../../shared/types/websocket";
import { isBunWebSocket, isSocketOpen } from "../../shared/utils/websocket";

const connections = new Map<string, AnyWebSocket[]>();

export const addConnection = (userId: string, ws: AnyWebSocket) => {
  if (!connections.has(userId)) {
    connections.set(userId, []);
  }
  connections.get(userId)?.push(ws);
};

export const removeConnection = (userId: string, ws: AnyWebSocket) => {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const index = userConnections.findIndex(
    (conn) => getWebSocketData(conn).userId === getWebSocketData(ws).userId,
  );
  if (index !== -1) {
    userConnections.splice(index, 1);
    if (userConnections.length === 0) connections.delete(userId);
  }
};

export const sendToUser = (userId: string, message: any) => {
  const userConnections = connections.get(userId);

  if (!userConnections) return;
  userConnections.forEach((ws) => {
    try {
      const socket = isBunWebSocket(ws) ? ws : ws.raw;
      if (isSocketOpen(ws)) {
        socket.send(JSON.stringify(message));
      }
    } catch (error) {
      console.error("Error sending message:", userId, error);
    }
  });
};

// Helper function to get data from either type
export const getWebSocketData = (ws: AnyWebSocket): WebSocketData => {
  return isBunWebSocket(ws) ? ws.data : ws.raw.data;
};
