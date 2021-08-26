import { RedisClient } from "redis";
import Websocket from "ws";
import { CONNECTED_CLIENTS } from "../constants";

export default class {
  constructor(private redisClient: RedisClient) {}

  saveConnectedClients(username: string) {}
  removeFromConnectedClients(username: string) {}
  async getClient(username: string): Promise<string> {
    return "";
  }
}
