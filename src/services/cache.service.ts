import { WrappedNodeRedisClient } from "handy-redis";
import { CONNECTED_CLIENTS } from "../constants";

export default class {
  constructor(private redisClient: WrappedNodeRedisClient) {}

  saveConnectedClients(username: string) {
    return this.redisClient.hset(CONNECTED_CLIENTS, [username, username]);
  }

  removeFromConnectedClients(username: string) {
    return this.redisClient.hdel(CONNECTED_CLIENTS, username);
  }

  getUsersOnline() {
    return this.redisClient.hgetall(CONNECTED_CLIENTS);
  }

  /**
   *
   * @param roomName The roomName which serves as the key
   * @param username The username which gets added to the room dictionary
   *
   * The roomName value is stored as a dictionary(Map<string, string>)
   * so the username could be retrieved easily with O(1)
   */
  async addUserToRoom(roomName: string, username: string) {
    let room = await this.getRoomUsersOnline(roomName);
    room = { ...room };
    room[username] = username;
    await this.redisClient.set(roomName, JSON.stringify(room));
  }

  async removeUserFromRoom(roomName: string, username: string) {
    let room = await this.getRoomUsersOnline(roomName);
    if (room) {
      delete room[username];
    }

    await this.redisClient.set(roomName, JSON.stringify(room));
  }

  async getRoomUsersOnline(roomName: string) {
    let roomUsersStr = await this.redisClient.get(roomName);
    if (!roomUsersStr) return null;

    const room: {
      [key: string]: string;
    } = JSON.parse(roomUsersStr);

    return room;
  }

  async getClient(username: string) {
    return this.redisClient.hget(CONNECTED_CLIENTS, username);
  }
}
