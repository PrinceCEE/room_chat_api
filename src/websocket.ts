import { Server } from "ws";
import { Server as HttpServer } from "http";
import { ORIGIN } from "./constants";

export default (httpServer: HttpServer) => {
  const Wss = new Server({ noServer: true });

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
    ws.on("message", data => {});

    // handle close event
    ws.on("close", () => console.log("Client disconnected"));
  });
};
