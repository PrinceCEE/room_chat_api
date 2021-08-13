import { Req, Res, Next } from "../interface";
import { NotImplementedError } from "../errors";

export const getAllRooms = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const createRoom = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const leaveRoom = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const deleteRoom = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};