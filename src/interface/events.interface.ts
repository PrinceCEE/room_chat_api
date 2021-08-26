export type ClientEventNames =
  | "authentication"
  | "joinRoom"
  | "leaveRoom"
  | "chatMessage";

type ServerEventNames =
  | "newMember"
  | "leftRoom"
  | "chatMessage"
  | "online"
  | "offline"
  | "allUsersOnline"
  | "roomUsersOnline";

// define a tuple-type for the events
export type WsEvent<T, U> = [T, U];

// Data events interfaces
interface IAuthentication {
  accessToken: string;
}

interface IJoinRoom {
  roomName: string;
  username: string;
}

interface ILeaveRoom {
  roomName: string;
  username: string;
}

interface IClientChatMessage {
  username: string;
  roomName: string;
  message: string;
}

interface INewMember {
  username: string;
  roomName: string;
}

interface ILeftRoom {
  username: string;
  roomName: string;
}

interface IServerChatMessage {
  username: string;
  roomName: string;
  message;
  string;
}

interface IOnline {
  username: string;
  roomNames: string[];
}

interface IOffline {
  username: string;
  roomNames: string[];
}

interface IAllUsersOnline {
  count: number;
  usernames: string[];
}

interface IRoomUsersOnline {
  count: number;
  usernames: string[];
}

// Client events
export type AuthEvent = WsEvent<ClientEventNames, IAuthentication>;
export type JoinRoomEvent = WsEvent<ClientEventNames, IJoinRoom>;
export type LeaveRoomEvent = WsEvent<ClientEventNames, ILeaveRoom>;
export type ClientChatMessageEvent = WsEvent<
  ClientEventNames,
  IClientChatMessage
>;

// Server events
export type NewMemberEvent = WsEvent<ServerEventNames, INewMember>;
export type LeftRoomEvent = WsEvent<ServerEventNames, ILeftRoom>;
export type ServerChatMessageEvent = WsEvent<
  ServerEventNames,
  IServerChatMessage
>;
export type OnlineEvent = WsEvent<ServerEventNames, IOnline>;
export type OfflineEvent = WsEvent<ServerEventNames, IOffline>;
export type AllUsersOnlineEvent = WsEvent<ServerEventNames, IAllUsersOnline>;
export type RoomUsersOnlineEvent = WsEvent<ServerEventNames, IRoomUsersOnline>;
