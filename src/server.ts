/**
 * Author - Chimezie Edeh
 * Date - August 7, 2021
 * Description - A basic clustered server API for two persons and room chats, while using Redis for keeping count of all connected clients
 * Tools - NodeJs, MongoDB, Redis
 */

import http from 'http';
import throng from 'throng';
import config from 'dotenv';
import App from './app';
import Wss from './websocket';

config.config();
const PORT = process.env.NODE_ENV || 3000;

// bootstrap init http and websocket servers
function bootstrap() {
  const server = http.createServer(App);
  Wss(server); 
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

// spin x servers, where x is the number of cpu cores
throng({ worker: bootstrap });
// 0. Set up the project architecture
// 1. Clients register
// 2. Clients login
// 3. Clients get authenticated to the websocket server after logging in
// 4. Clients create chat rooms
// 5. Clients join chat rooms
// 6. Clients leave chat rooms
// 7. Clients delete chat rooms
// 8. Clients chat with each other