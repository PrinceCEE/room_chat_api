import { Req, Res, Next } from "../interface";
import { NotImplementedError } from '../errors';

export const registerController = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};

export const loginController = async (req: Req, res: Res, next: Next) => {
  next(new NotImplementedError());
};