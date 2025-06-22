import { ServerWebSocket } from "bun";
import { AnyWebSocket, WebSocketData } from "../types/websocket";

const WS_READY_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

// Type guard to check if it's Bun's native WebSocket
export function isBunWebSocket(
  ws: AnyWebSocket,
): ws is ServerWebSocket<WebSocketData> {
  return "data" in ws && "send" in ws;
}

export const getSocket = (ws: AnyWebSocket): ServerWebSocket<WebSocketData> => {
  return isBunWebSocket(ws) ? ws : ws.raw;
};

export const isSocketOpen = (ws: AnyWebSocket): boolean => {
  const socket = getSocket(ws);
  return socket.readyState === WS_READY_STATES.OPEN;
};

// Helper to normalize WebSocket types
export const normalizeWebSocket = (ws: any): AnyWebSocket => {
  // If it's already a Bun WebSocket
  if ("sendText" in ws) return ws;

  // If it's Hono's WSContext
  return {
    raw: ws.raw,
    send: ws.send.bind(ws),
    data: ws.data,
  };
};
