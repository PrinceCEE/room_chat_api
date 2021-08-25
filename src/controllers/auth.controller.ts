import {
  Req,
  Res,
  Next,
  IResponse,
  IUser
} from "../interface";
import { RegisterDto } from "../dtos";
import userService from "../services/user.service";
import { getAccessToken } from '../utils';

export const registerController = async (req: Req, res: Res, next: Next) => {
  const body: RegisterDto = req.body,
    user = await userService.createUser(body),
    accessToken = getAccessToken({
      sub: user.id,
      username: user.username
    });

  const response: IResponse = {
    success: true,
    data: {
      user,
      accessToken,
      message: `${user.username}, welcome!`
    }
  };
  res.json(response);
};

export const loginController = async (req: Req, res: Res, next: Next) => {
  const user = req.user as IUser;
  const accessToken = getAccessToken({
    sub: user.id,
    username: user.username
  });

  const response: IResponse = {
    success: true,
    data: {
      user,
      accessToken,
      message: `${user.username}, welcome!`
    }
  };
  res.json(response);
};