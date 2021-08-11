import { Req, Res, Next } from '../interface';
import { RegisterDto, LoginDto } from '../dtos';
import { RegisterValidator, LoginValidator } from '../validators';

export const registerMiddleware = (req: Req, res: Res, next: Next) => {
  next();
};

export const loginMiddleware = (req: Req, res: Res, next: Next) => {
  next();
};