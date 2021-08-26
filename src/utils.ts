import { decode, sign } from 'jsonwebtoken';
import { 
  IJwtPayload, 
  IResponse, 
  Next, 
  Req, 
  Res 
} from './interface';

export const getAccessToken = (payload: IJwtPayload) => {
  return sign(payload, "$ecret");
};

export const getJwtPayloadFromToken = (token: string) => {
  return decode(token);
}

export const asyncHandler = (
  fn: (req: Req, res: Res, next: Next) => Promise<void>
) => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      const response: IResponse = {
        data: err.message,
        success: false,
        statusCode: 500
      };
      res.status(500).json(response);
    });
  }
};