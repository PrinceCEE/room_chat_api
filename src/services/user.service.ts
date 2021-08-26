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

  async getUserRooms(id: string) {
    let user = await this.userModel.findOne({ _id: id }).populate("rooms");
    return user?.rooms.map(room => room.name);
  }
}

// exposing a singleton userservice across all controllers and middlewares
export default new UserService(UserModel);
