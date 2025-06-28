import { ServerWebSocket } from "bun";
export type WebSocketData = {
  userId: number;
  userPublicId: string;
};

// track incoming and outgoing messages
const connections = new Map<string, ServerWebSocket<WebSocketData>[]>();
// track online status
export const onlineStatus = new Map<string, boolean>();
// Track "user is in generate chat area"
export const chatAreaPresence = new Map<string, boolean>();
// track "user is currently viewing X' 1 on 1 chat"
export const chatFocus = new Map<string, string | null>();
// track user frinedship
export const friendshipMap = new Map<string, Set<string>>();
// track typing satus: user -> target they are typing
export const typingStatus = new Map<string, string | null>();

// Helper function to get data from either type
export const getWebSocketData = (
  ws: ServerWebSocket<WebSocketData>,
): WebSocketData => {
  return ws.data;
};

export const sendToUser = (userPublicId: string, message: any) => {
  const userConnections = connections.get(userPublicId);

  if (!userConnections) return;
  userConnections.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  });
};

export const notifyFriendsOfPresenceChange = (userPublicId: string) => {
  const friends = Array.from(friendshipMap.get(userPublicId) || []);
  const isOnline = onlineStatus.get(userPublicId) || false;
  const isInChat = chatAreaPresence.get(userPublicId) || false;

  for (const friendId of friends) {
    const isInThisChat = chatFocus.get(userPublicId) === friendId;
    sendToUser(friendId, {
      type: "presence_update",
      userPublicId,
      presence: {
        isOnline,
        isInChat,
        isInThisChat,
      },
    });
  }
};

// notify specific user about typing status
export const notifyTypingStatus = (
  senderPublicId: string,
  targetPublicId: string,
  isTyping: boolean,
) => {
  sendToUser(targetPublicId, {
    type: "typing_status",
    senderPublicId,
    isTyping,
  });
};

// handle typing events
export const setTypingStatus = (
  senderPublicId: string,
  targetPublicId: string,
  isTyping: boolean,
) => {
  // prevent self-typing notification
  if (senderPublicId === targetPublicId) return;
  // updata typing state
  typingStatus.set(senderPublicId, isTyping ? targetPublicId : null);
  // notify the target user
  notifyTypingStatus(senderPublicId, targetPublicId, isTyping);
};

export const addConnection = async (
  userPublicId: string,
  ws: ServerWebSocket<WebSocketData>,
) => {
  if (!connections.has(userPublicId)) {
    connections.set(userPublicId, []);
  }
  connections.get(userPublicId)?.push(ws);
  // update online status and notify all connected clients
  // set initial online status
  onlineStatus.set(userPublicId, true);
  notifyFriendsOfPresenceChange(userPublicId);
  // send friend status to new user
  sendFriendsPresenceToUser(userPublicId);
};

// remove connection function
export const removeConnection = async (
  userPublicId: string,
  ws: ServerWebSocket<WebSocketData>,
) => {
  const userConnections = connections.get(userPublicId) || [];

  if (!userConnections) return;

  const updateConnections = userConnections.filter((conn) => conn !== ws);

  if (updateConnections.length > 0) {
    connections.set(userPublicId, updateConnections);
  } else {
    connections.delete(userPublicId);
    onlineStatus.set(userPublicId, false);
    chatAreaPresence.set(userPublicId, false);
    chatFocus.set(userPublicId, null);
    notifyFriendsOfPresenceChange(userPublicId);
  }

  // clear typing status
  const typingTarget = typingStatus.get(userPublicId);
  if (typingTarget) {
    notifyTypingStatus(userPublicId, typingTarget, false);
    typingStatus.delete(userPublicId);
  }
};

export const sendFriendsPresenceToUser = (userPublicId: string) => {
  const friends = Array.from(friendshipMap.get(userPublicId) || []);
  for (const friendId of friends) {
    const isOnline = onlineStatus.get(friendId) || false;
    const isInChat = chatAreaPresence.get(friendId) || false;
    const isInThisChat = chatFocus.get(friendId) === friendId;
    sendToUser(userPublicId, {
      type: "presence_update",
      userPublicId: friendId,
      presence: {
        isOnline,
        isInChat,
        isInThisChat,
      },
    });
  }
};

//friendship management
export const addFriendship = (userA: string, userB: string) => {
  // ensure userA entry exist
  if (!friendshipMap.has(userA)) {
    friendshipMap.set(userA, new Set());
  }
  // ensure userB entry exist
  if (!friendshipMap.has(userB)) {
    friendshipMap.set(userB, new Set());
  }
  // add each other as friends (set prevent duplication)
  friendshipMap.get(userA)!.add(userB);
  friendshipMap.get(userB)!.add(userA);
};

// chat area presnece
export const setChatAreaPresence = (
  userPublicId: string,
  isInChat: boolean,
) => {
  chatAreaPresence.set(userPublicId, isInChat);
  notifyFriendsOfPresenceChange(userPublicId);
};

export const setChatFocus = (
  viewerPublicId: string,
  targetPublicId: string,
) => {
  if (viewerPublicId === targetPublicId) return;
  // clear previous focus
  const prevFocus = chatFocus.get(viewerPublicId);
  if (prevFocus) {
    notifyFriendsOfPresenceChange(viewerPublicId);
  }
  // set new focus
  chatFocus.set(viewerPublicId, targetPublicId);
  notifyFriendsOfPresenceChange(viewerPublicId);

  // notify target is exist
  if (targetPublicId) {
    notifyFriendsOfPresenceChange(targetPublicId);
  }
};
