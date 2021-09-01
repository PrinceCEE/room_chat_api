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
export interface IAuthentication {
  accessToken: string;
}

export interface IJoinRoom {
  roomName: string;
  username: string;
}

export interface ILeaveRoom {
  roomName: string;
  username: string;
}

export interface IClientChatMessage {
  username: string;
  roomName: string;
  message: string;
}

export interface INewMember {
  username: string;
  roomName: string;
}

export interface ILeftRoom {
  username: string;
  roomName: string;
}

export interface IServerChatMessage {
  username: string;
  roomName: string;
  message: string;
}

export interface IOnline {
  username: string;
  roomNames: string[];
}

export interface IOffline {
  username: string;
  roomNames: string[];
}

export interface IAllUsersOnline {
  count: number;
  usernames: string[];
}

export interface IRoomUsersOnline {
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
