/**
 * Author - Chimezie Edeh
 * Date - August 7, 2021
 * Description - A basic clustered server API for two persons and room chats, while using Redis for keeping count of all connected clients
 * Tools - NodeJs, MongoDB, Redis
 */

import http from "http";
import throng from "throng";
import mongoose from "mongoose";
import config from "dotenv";
import App from "./app";
import Wss from "./websocket";

config.config();
const PORT = process.env.NODE_ENV || 3000;

// bootstrap http and websocket servers
async function bootstrap() {
  // connect to the DB
  await mongoose.connect(process.env.DB_URL as string, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // create http server
  const server = http.createServer(App);

  // create websocket server
  Wss(server);

  // bind the http server to listen on $PORT
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

function start() {
  bootstrap().catch(err => console.log(err.message));
}

// spin x servers, where x is the number of cpu cores
throng({
  worker: start,
});
