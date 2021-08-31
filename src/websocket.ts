import Websocket, { Server } from "ws";
import { Server as HttpServer } from "http";
import { WrappedNodeRedisClient } from "handy-redis";
import { ORIGIN } from "./constants";
import {
  AuthEvent,
  ClientEventNames,
  JoinRoomEvent,
  NewMemberEvent,
  WsEvent,
  IJoinRoom,
  RoomUsersOnlineEvent,
  IRoomUsersOnline,
  OnlineEvent,
  OfflineEvent,
  AllUsersOnlineEvent,
  IAllUsersOnline,
} from "./interface/events.interface";
import NRP from "node-redis-pubsub";
import CacheService from "./services/cache.service";
import { getJwtPayloadFromToken } from "./utils";
import userService from "./services/user.service";

export default (
  httpServer: HttpServer,
  redisClient: WrappedNodeRedisClient,
  pid: number,
) => {
  /**
   * Store an internal Map of the connected clients in each cluster,
   * using their username as the key and the `ws` as the value,
   * then save the usernames of the connected clients to Redis
   */
  const connectedClientSockets = new Map<string, Websocket>();

  const Wss = new Server({ noServer: true }),
    cacheService = new CacheService(redisClient),
    nrp = new NRP.NodeRedisPubSub({ port: 6379 });

  // associate all the events to listen for
  nrp.on("joinRoom", data => {
    let [eventName, message, clusterId]: [string, IJoinRoom, number] =
      JSON.parse(data);

    /**
     * making sure that the cluster that published
     * the event isn't going to broadcast
     **/
    if (clusterId !== pid) {
      Wss.clients.forEach(ws => {
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
  });

  nrp.on("joinRoom", data => {
    let [eventName, message, clusterId]: [string, IRoomUsersOnline, number] =
      JSON.parse(data);

    /**
     * making sure that the cluster that published
     * the event isn't going to broadcast
     **/
    if (clusterId !== pid) {
      Wss.clients.forEach(ws => {
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
  });

  nrp.on("online", async data => {
    let [eventName, message, clusterId]: [
      string,
      { username: string },
      number,
    ] = JSON.parse(data);

    /**
     * making sure that the cluster that published
     * the event isn't going to broadcast
     */
    if (clusterId !== pid) {
      for await (let ws of Wss.clients) {
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
  });

  nrp.on("offline", async data => {
    let [eventName, message, clusterId]: [
      string,
      { username: string },
      number,
    ] = JSON.parse(data);

    /**
     * making sure that the cluster that published
     * the event isn't going to broadcast
     */
    if (clusterId !== pid) {
      for await (let ws of Wss.clients) {
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
  });

  nrp.on("allUsersOnline", async data => {
    let [eventName, message, clusterId]: [string, IAllUsersOnline, number] =
      JSON.parse(data);

    /**
     * making sure that the cluster that published
     * the event isn't going to broadcast
     */
    if (clusterId !== pid) {
      Wss.clients.forEach(ws => ws.send([eventName, message]));
    }
  });

  // handle upgrade events from the server
  httpServer.on("upgrade", (req, socket, head) => {
    // check for the origin
    const origin = req.headers.origin,
      NODE_ENV = process.env.NODE_ENV;

    if (!origin) {
      socket.write("HTTP/1.1 401 Unauthorized");
      socket.destroy();
      return;
    }

    if (NODE_ENV === "development") {
      if (origin !== "http://localhost:3000") {
        socket.write("HTTP/1.1 401 Unauthorized");
        socket.destroy();
        return;
      }
    }

    if (NODE_ENV === "production") {
      if (origin !== ORIGIN) {
        socket.write("HTTP/1.1 401 Unauthorized");
        socket.destroy();
        return;
      }
    }

    // handle the upgrade
    // @ts-ignore
    Wss.handleUpgrade(req, socket, head, (ws, req) => {
      Wss.emit("connection", ws, req);
    });
  });

  Wss.on("connection", (ws, _) => {
    let username: string;

    // register the socket
    ws.on("message", async (data: WsEvent<string, any>) => {
      let eventName = data[0] as ClientEventNames;

      /**
       * When a client comes online, the first message to be sent
       * is the `authentication` event.
       * If the authentication is successful, initialise
       * the username field.
       * Save the client's username to Redis and update the `connectedClientSockets`
       * Send an `Online` event to the connected clients
       * Send the `allUsersOnline` event to all connected clients
       * Publish `Online` event to other clusters so they can send to
       * their connected clients
       * Publish the `allUserOnline` event to other clusters
       */
      if (eventName === "authentication") {
        const [_, message] = data as AuthEvent;
        const payload = getJwtPayloadFromToken(message.accessToken);
        if (!payload.username) {
          ws.close(1, "Unauthorised");
          return;
        }

        username = payload.username;
        await cacheService.saveConnectedClients(username);
        connectedClientSockets.set(username, ws);

        const clientsOnline = await cacheService.getUsersOnline(),
          clientUsernames = Object.keys(clientsOnline),
          allUsersOnlineData: AllUsersOnlineEvent = [
            "allUsersOnline",
            {
              count: clientUsernames.length,
              usernames: clientUsernames,
            },
          ];

        for await (let ws of Wss.clients) {
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
        Wss.clients.forEach(ws => ws.send(allUsersOnlineData));
        nrp.emit("online", JSON.stringify(["online", { username }, pid]));
        nrp.emit(
          "allUsersOnline",
          JSON.stringify(["allUsersOnline", allUsersOnlineData, pid]),
        );
      } else {
        if (!(await cacheService.getClient(data[1].username))) {
          ws.close(1, "Unauthorised");
          return;
        }

        // handle the various messages from the clients
        switch (eventName) {
          case "joinRoom":
            /**
             * To join a room, get the room name and the username of the
             * user.
             * Store the username in the room
             * Broadcast to all connected clients the newMember event
             * Broadcast the room members to connected clients
             * Publish the joinRoom event to other clusters, so they can broadcast
             * to connected clients the newMember event.
             * Publish the roomUsersOnline event
             */
            let [_, message] = data as JoinRoomEvent;

            await cacheService.addUserToRoom(
              message.roomName,
              message.username,
            );

            let newMemberData: NewMemberEvent = [
                "newMember",
                {
                  username: message.username,
                  roomName: message.roomName,
                },
              ],
              room = await cacheService.getRoomUsersOnline(message.roomName),
              roomArr = Object.keys(room as object),
              roomUsersOnlineData: RoomUsersOnlineEvent = [
                "roomUsersOnline",
                {
                  count: roomArr.length,
                  usernames: roomArr,
                },
              ];

            Wss.clients.forEach(ws => ws.send(newMemberData));
            Wss.clients.forEach(ws => ws.send(roomUsersOnlineData));
            nrp.emit("joinRoom", JSON.stringify([...newMemberData, pid]));
            nrp.emit(
              "roomUsersOnline",
              JSON.stringify([...roomUsersOnlineData, pid]),
            );

            break;
          case "chatMessage":
            // not implemented
            break;
          case "leaveRoom":
            // not implemented
            break;
        }
      }
    });

    /**
     * Handle the connection close event
     * send a close event to all connected clients
     */
    ws.on("close", async () => {
      await cacheService.removeFromConnectedClients(username);
      connectedClientSockets.delete(username);

      for await (let ws of Wss.clients) {
        const roomNames = (await userService.getUserRooms(
          undefined,
          username,
        )) as string[];

        if (roomNames?.length > 0) {
          const onlineData: OfflineEvent = [
            "offline",
            {
              username,
              roomNames,
            },
          ];
          ws.send(onlineData);
        }
      }

      nrp.emit("offline", JSON.stringify(["offline", { username }, pid]));
    });
  });
};
