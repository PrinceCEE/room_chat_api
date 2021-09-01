import { Server } from "ws";
import {
  IJoinRoom,
  IRoomUsersOnline,
  IAllUsersOnline,
  IServerChatMessage,
  ILeftRoom,
} from "./interface/events.interface";
import userService from "./services/user.service";

/**
 * The cluster subscriber event handler
 * Makes sure that a cluster doesn't process the event it
 * published
 */
export default class {
  constructor(private pid: number, private wss: Server) {}

  handleJoinRoom = data => {
    let [eventName, message, clusterId]: [string, IJoinRoom, number] =
      JSON.parse(data);

    if (clusterId !== this.pid) {
      this.wss.clients.forEach(ws => {
        const data = [
          eventName,
          {
            username: message.username,
            roomName: message.roomName,
          },
        ];
        ws.send(data);
      });
    }
  };

  handleRoomUsersOnline = data => {
    let [eventName, message, clusterId]: [string, IRoomUsersOnline, number] =
      JSON.parse(data);

    if (clusterId !== this.pid) {
      this.wss.clients.forEach(ws => {
        const data = [
          eventName,
          {
            count: message.count,
            usernames: message.usernames,
          },
        ];
        ws.send(data);
      });
    }
  };

  handleOnline = async data => {
    let [eventName, message, clusterId]: [
      string,
      { username: string },
      number,
    ] = JSON.parse(data);

    if (clusterId !== this.pid) {
      for await (let ws of this.wss.clients) {
        const roomNames = (await userService.getUserRooms(
          undefined,
          message.username,
        )) as string[];

        if (roomNames?.length > 0) {
          const onlineData = [
            eventName,
            {
              username: message.username,
              roomNames,
            },
          ];
          ws.send(onlineData);
        }
      }
    }
  };

  handleOffline = async data => {
    let [eventName, message, clusterId]: [
      string,
      { username: string },
      number,
    ] = JSON.parse(data);

    if (clusterId !== this.pid) {
      for await (let ws of this.wss.clients) {
        const roomNames = (await userService.getUserRooms(
          undefined,
          message.username,
        )) as string[];

        if (roomNames?.length > 0) {
          const onlineData = [
            eventName,
            {
              username: message.username,
              roomNames,
            },
          ];
          ws.send(onlineData);
        }
      }
    }
  };

  handleAllUsersOnline = data => {
    let [eventName, message, clusterId]: [string, IAllUsersOnline, number] =
      JSON.parse(data);

    if (clusterId !== this.pid) {
      this.wss.clients.forEach(ws => ws.send([eventName, message]));
    }
  };

  handleChatMessgae = data => {
    let [eventName, message, clusterId]: [string, IServerChatMessage, number] =
      data;
    if (clusterId !== this.pid) {
      this.wss.clients.forEach(ws => ws.send([eventName, message]));
    }
  };

  handleLeftRoom = data => {
    let [eventName, message, clusterId]: [string, ILeftRoom, number] = data;
    if (clusterId !== this.pid) {
      this.wss.clients.forEach(ws => ws.send([eventName, message]));
    }
  };
}
