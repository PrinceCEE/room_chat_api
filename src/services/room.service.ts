import { Model } from "mongoose";
import RoomModel from "../models/room.model";
import { IRoom } from "../interface";
import roomModel from "../models/room.model";

class RoomService {
  constructor(private roomModel: Model<IRoom>) {}

  async getAllRooms() {
    return this.roomModel.find({});
  }

  getRoom(roomName: string) {
    return this.roomModel.findOne({
      name: {
        $regex: roomName,
        $options: "i"
      }
    });
  }

  createRoom(roomName: string, username: string) {
    let room = new this.roomModel({
      name: roomName,
      creatorUsername: username,
    });
    return room.save();
  }

  async isAMember(roomName: string, userId: string) {
    let room = await this.getRoom(roomName);
    let id = room?.members.find(id => {
      return id.toString === userId;
    });
    return id !== undefined;
  }

  async leaveRoom(roomName: string, userId: string) {
    let room = await this.getRoom(roomName);
    let index = room?.members.findIndex(id => {
      return id.toString === userId;
    }) as number;

    if(index !== -1) {
      room?.members.splice(index, 1);
      await room?.save();
    }
  }

  async joinRoom(roomName: string, userId: string) {
    let room = await this.getRoom(roomName);
    room?.members.push(userId);
    return room?.save();
  }

  async isCreator(roomName: string, username: string) {
    return this.roomModel.findOne({
      name: new RegExp(roomName, "i"),
      creatorUsername: new RegExp(username, "i")
    });
  }

  async deleteRoom(roomName: string) {
    return this.roomModel.findOneAndDelete({
      name: new RegExp(roomName, "i")
    });
  }
}

// exposing a singleton roomservice across all controllers and middlewares
export default new RoomService(RoomModel);