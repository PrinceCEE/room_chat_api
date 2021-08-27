/**
 * Author - Chimezie Edeh
 * Date - August 7, 2021
 * Description - A basic clustered Chat server API for room chats, while using Redis for keeping count of all connected clients' usernames.
 * Tools - NodeJs, MongoDB, Redis
 */

import http from "http";
import throng from "throng";
import mongoose from "mongoose";
import config from "dotenv";
import App from "./app";
import Wss from "./websocket";
import { createNodeRedisClient } from "handy-redis";

config.config();
const PORT = process.env.NODE_ENV || 3000;

// bootstrap http and websocket servers
async function bootstrap(pid: number) {
  // connect to the DBs
  await mongoose.connect(process.env.DB_URL as string, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const RD_URL = process.env.RD_URL || "redis://127.0.0.1:6379";
  const redisClient = createNodeRedisClient(RD_URL);

  // create http server
  const server = http.createServer(App);

  // create websocket server
  Wss(server, redisClient, pid);

  // bind the http server to listen on $PORT
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

function start(pid: number) {
  bootstrap(pid).catch(err => console.log(err.message));
}

// spin x servers, where x is the number of cpu cores
throng({
  worker: start,
});
