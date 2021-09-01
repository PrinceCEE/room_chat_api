import Websocket, { Server } from "ws";
import NRP from "node-redis-pubsub";
import {
  IJoinRoom,
  NewMemberEvent,
  RoomUsersOnlineEvent,
  OnlineEvent,
} from "./interface";
import {
  AllUsersOnlineEvent,
  IClientChatMessage,
  ILeaveRoom,
} from "./interface/events.interface";
import cacheService from "./services/cache.service";
import userService from "./services/user.service";
import messageService from "./services/message.service";

export default class {
  constructor(
    private pid: number,
    private nrp: NRP.NodeRedisPubSub,
    private wss: Server,
    private cacheService: cacheService,
  ) {}

  /**
   * Send an `Online` event to the connected clients
   * Send the `allUsersOnline` event to all connected clients
   * Publish `Online` event to other clusters so they can send to
   * their connected clients
   * Publish the `allUserOnline` event to other clusters
   */
  handleAuthentication = async (username: string) => {
    await this.cacheService.saveConnectedClients(username);

    const clientsOnline = await this.cacheService.getUsersOnline(),
      clientUsernames = Object.keys(clientsOnline),
      allUsersOnlineData: AllUsersOnlineEvent = [
        "allUsersOnline",
        {
          count: clientUsernames.length,
          usernames: clientUsernames,
        },
      ];

    for await (let ws of this.wss.clients) {
      const roomNames = (await userService.getUserRooms(
        undefined,
        username,
      )) as string[];

      if (roomNames?.length > 0) {
        const onlineData: OnlineEvent = [
          "online",
          {
            username,
            roomNames,
          },
        ];
        ws.send(onlineData);
      }
    }
    this.wss.clients.forEach(ws => ws.send(allUsersOnlineData));
    this.nrp.emit("online", JSON.stringify(["online", { username }, this.pid]));
    this.nrp.emit(
      "allUsersOnline",
      JSON.stringify(["allUsersOnline", allUsersOnlineData, this.pid]),
    );
  };

  /**
   * Store the username in the room
   * Broadcast to all connected clients the newMember event
   * Broadcast the room members to connected clients
   * Publish the joinRoom event to other clusters, so they can broadcast
   * to connected clients the newMember event.
   * Publish the roomUsersOnline event
   */
  handleJoinRoom = async (message: IJoinRoom) => {
    await this.cacheService.addUserToRoom(message.roomName, message.username);

    let newMemberData: NewMemberEvent = [
        "newMember",
        {
          username: message.username,
          roomName: message.roomName,
        },
      ],
      room = await this.cacheService.getRoomUsersOnline(message.roomName),
      roomArr = Object.keys(room as object),
      roomUsersOnlineData: RoomUsersOnlineEvent = [
        "roomUsersOnline",
        {
          count: roomArr.length,
          usernames: roomArr,
        },
      ];

    this.wss.clients.forEach(ws => ws.send(newMemberData));
    this.wss.clients.forEach(ws => ws.send(roomUsersOnlineData));
    this.nrp.emit("joinRoom", JSON.stringify([...newMemberData, this.pid]));
    this.nrp.emit(
      "roomUsersOnline",
      JSON.stringify([...roomUsersOnlineData, this.pid]),
    );
  };

  /**
   * Broadcast the message to other connected clients
   * but not the client that sent the message
   * Publish the message to other clusters to broadcast
   * Save the message to the database
   */
  handleChatMessage = async (
    message: IClientChatMessage,
    client: Websocket,
  ) => {
    this.wss.clients.forEach(ws => {
      ws !== client && ws.send(["chatMessage", message]);
    });

    this.nrp.emit(
      "chatMessage",
      JSON.stringify(["chatMessage", message, this.pid]),
    );

    const newMsg = await messageService.createNewMessage(message);
    await userService.updateUserMessages(message.username, newMsg.id);
  };

  /**
   * Remove the user from the redis db
   * broadcast to the connected clients
   * publish to the other clusters
   */
  handleLeaveRoom = async (message: ILeaveRoom, client: Websocket) => {
    await this.cacheService.removeUserFromRoom(
      message.roomName,
      message.roomName,
    );

    this.wss.clients.forEach(ws => {
      ws !== client && ws.send(["leftRoom", message]);
    });

    this.nrp.emit("leftRoom", JSON.stringify(["leftRoom", message, this.pid]));
  };
}
