import type { ServerWebSocket } from "bun";

export type WebSocketData = {
  userId: string;
};

// Union type that works with both WebSocket types
export type AnyWebSocket =
  | ServerWebSocket<WebSocketData> // Bun's native WebSocket
  | {
      raw: ServerWebSocket<WebSocketData>;
      send: (message: string) => void;
      data: WebSocketData;
    }; // Hono's WSContext wrapper
