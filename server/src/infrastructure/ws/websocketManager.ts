import { ServerWebSocket } from "bun";
import { prisma } from "../db/db";

export type WebSocketData = {
  userId: number;
  userPublicId: string;
};

// track incoming and outgoing messages
const connections = new Map<string, ServerWebSocket<WebSocketData>[]>();
// track online status
export const onlineStatus = new Map<string, boolean>();

export const addConnection = async (
  userId: number,
  userPublicId: string,
  ws: ServerWebSocket<WebSocketData>,
) => {
  if (!connections.has(userPublicId)) {
    connections.set(userPublicId, []);
  }
  connections.get(userPublicId)?.push(ws);
  // send current online status to new connections
  await setOnlineStatus(userId, userPublicId, true);
};

export const removeConnection = async (
  userId: number,
  userPublicId: string,
  ws: ServerWebSocket<WebSocketData>,
) => {
  const userConnections = connections.get(userPublicId);
  if (!userConnections) return;

  const index = userConnections.findIndex(
    (conn) =>
      getWebSocketData(conn).userPublicId === getWebSocketData(ws).userPublicId,
  );
  if (index !== -1) {
    userConnections.splice(index, 1);
    if (userConnections.length === 0) {
      connections.delete(userPublicId);
      // set user as offline only if no connections remain
      await setOnlineStatus(userId, userPublicId, false);
    }
  }
};

export const sendToUser = (userPublicId: string, message: any) => {
  const userConnections = connections.get(userPublicId);

  if (!userConnections) return;
  userConnections.forEach((ws) => {
    try {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(message));
      }
    } catch (error) {
      console.error("Error sending message:", userPublicId, error);
    }
  });
};

// this part is handling online status
export const setOnlineStatus = async (
  userId: number,
  userPublicId: string,
  isOnline: boolean,
) => {
  onlineStatus.set(userPublicId, isOnline);
  // console.log(onlineStatus);
  await broadcastStatusChage(userId, userPublicId, isOnline);
};

export const getOnlineStatus = (userPubliId: string) => {
  return onlineStatus.get(userPubliId) || false;
};

const broadcastStatusChage = async (
  userId: number,
  userPublicId: string,
  isOnline: boolean,
) => {
  // 1. get user friend
  // 2. get user room members
  // 3. send status updates to all these connections
  const friends = await findFriends(userId, "accepted");
  friends.forEach((friend) => {
    sendToUser(friend.publicId, {
      type: "online_status",
      userPublicId,
      isOnline,
    });
  });
};

// const sendInitialPresence = async (userId: number, userPublicId: string) => {
//   // get friends and room members online statuses
//   const friends = await findFriends(userId, "accepted");
//   const initialPresence = {
//     type: "INITIAL_PRESENCE",
//     friends: friends.map((friend) => ({
//       userPublicId: friend.publicId,
//       isOnline: isUserOnline(friend.publicId),
//     })),
//   };
//
//   sendToUser(userPublicId, initialPresence);
// };

// Helper function to get data from either type
export const getWebSocketData = (
  ws: ServerWebSocket<WebSocketData>,
): WebSocketData => {
  return ws.data;
};

const findFriends = async (
  userId: number,
  status: string,
): Promise<
  { id: number; publicId: string; username: string; created_at: Date }[]
> => {
  return await prisma.$queryRaw`
      SELECT DISTINCT 
        u2.id as id, 
        u2.public_id as publicId, 
        u2.username as username, 
        f.created_at as createdAt 
      FROM users as u1
      JOIN friendships as f ON u1.id = f.requestee_id OR u1.id = f.requester_id
      JOIN users as u2 ON f.requestee_id = u2.id OR f.requester_id = u2.id
      WHERE u1.id = ${userId} AND NOT u2.id = ${userId} AND status = ${status};
    `;
};
