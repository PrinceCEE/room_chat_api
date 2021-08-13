import { Req, Res, Next } from "../interface";
import { NotImplementedError } from "../errors";

export const myProfile = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const getUserProfile = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const updateMyProfile = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const getMyRooms = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};