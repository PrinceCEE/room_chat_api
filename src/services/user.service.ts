import { Model } from "mongoose";
import { compare } from "bcrypt";
import { RegisterDto } from "../dtos";
import { IUser } from "../interface";
import UserModel from "../models/user.model";

class UserService {
  constructor(private userModel: Model<IUser>) {}

  /**
   * Use regex to search for the username
   * so that the case of the username wouldn't matter
   */
  getUserByusername(username: string) {
    return this.userModel.findOne({
      username: {
        $regex: username,
        $options: "i",
      },
    });
  }

  createUser(data: RegisterDto) {
    return new this.userModel(data).save();
  }

  /**
   *
   * @param pwd The password submitted by the user
   * @param password The password stored in the user document
   * @returns Promise<boolean>
   */
  comparePassword(pwd: string, password: string) {
    return compare(pwd, password);
  }

  async getUserRooms(id?: string, username?: string) {
    let user = id
      ? await this.userModel.findOne({ _id: id }).populate("rooms")
      : await this.userModel.findOne({
          username: {
            $regex: username,
            $options: "i",
          },
        });
    return user?.rooms.map(room => room.name);
  }

  async updateUserMessages(username: string, messageId: string) {
    this.userModel.findOneAndUpdate(
      {
        username: {
          $regex: username,
          $options: "i",
        },
      },
      {
        $push: {
          messages: messageId,
        },
      },
    );
  }
}

// exposing a singleton userservice across all controllers and middlewares
export default new UserService(UserModel);
