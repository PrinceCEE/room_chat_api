import _ from 'lodash';
import { Req, Res, Next, IResponse, IUser } from "../interface";
import { NotImplementedError } from "../errors";
import userService from "../services/user.service";
import { UpdateDto } from "../dtos";

export const myProfile = async (req: Req, res: Res, next: Next) => {
  const response: IResponse = {
    success: true,
    data: req.user
  };
  res.json(response);
};

export const getUserProfile = async (req: Req, res: Res, next: Next) => {
  const { username } = req.params;
  const user = await userService.getUserByusername(username);
  
  const response: IResponse = {
    success: true,
    data: user
  };
  res.json(response);
};

export const updateMyProfile = async (req: Req, res: Res, next: Next) => {
  let body = req.body,
    user = req.user as IUser;
  
  if(body.password) {
    user.hashPassword(body.password);
  }
  
  body = _.omit(body, ["password"]);
  for(let key in body) {
    if(body[key]) user[key] = body[key];
  }
  user = await user.save();

  const response: IResponse = {
    success: true,
    data: {
      user,
      message: "Account successfully updated"
    }
  };
  res.json(response);
};

export const getMyRooms = async (req: Req, res: Res, next: Next) => {
  const user = req.user as IUser;
  const rooms = await userService.getUserRooms(user.id);
  const response: IResponse = {
    success: true,
    data: rooms
  }
  res.json(response);
};