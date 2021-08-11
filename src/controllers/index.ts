import { Req, Res, Next } from "../interface";
import { NotImplementedError } from "../errors";

export const registerController = (req: Req, res: Res, next: Next) => {
  return next(new NotImplementedError());
};

export const loginController = (req: Req, res: Res, next: Next) => {
  return next(new NotImplementedError());
};