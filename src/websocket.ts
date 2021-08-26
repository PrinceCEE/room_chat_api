import { Server } from "ws";
import { Server as HttpServer } from "http";
import { ORIGIN } from "./constants";
import {
  AuthEvent,
  ClientEventNames,
  WsEvent,
} from "./interface/events.interface";
import { RedisClient } from "redis";
import CacheService from "./services/cache.service";
import { getJwtPayloadFromToken } from "./utils";

export default (httpServer: HttpServer, redisClient: RedisClient) => {
  const Wss = new Server({ noServer: true });
  const cacheService = new CacheService(redisClient);

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
      if (origin !== "localhost:3000") {
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

  Wss.on("connection", (ws, req) => {
    // register the socket
    ws.on("message", async (data: WsEvent<string, any>) => {
      let eventName = data[0] as ClientEventNames;
      if (eventName === "authentication") {
        const [_, message] = data as AuthEvent;
        const { username } = getJwtPayloadFromToken(message.accessToken);
        if (!username) {
          ws.close(1, "Unauthorised");
          return;
        }

        await cacheService.saveConnectedClients(username);
      } else {
        // check if the username is stored in the ws cache
        const { username } = data[1];
        if (!(await cacheService.getClient(username))) {
          ws.close(1, "Unauthorised");
          return;
        }

        // handle the various messages from the clients
        switch (eventName) {
          case "joinRoom":
            // not implemented
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

    // handle close event
    ws.on("close", () => console.log("Client disconnected"));
  });
};
