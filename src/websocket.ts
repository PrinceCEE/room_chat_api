import { Server } from 'ws';
import { Server as HttpServer } from 'http'

export default (httpServer: HttpServer) => {
  const Wss = new Server({ server: httpServer });

  // handle upgrade events from the server
  httpServer.on("upgrade", (req, socket, head) => {

  });

  Wss.on("connection", (ws, req) => {

  });
}