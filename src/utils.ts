import { decode, sign } from 'jsonwebtoken';
import { IJwtPayload } from './interface';

export const getAccessToken = (payload: IJwtPayload) => {
  return sign(payload, "$ecret");
};

export const getJwtPayloadFromToken = (token: string) => {
  return decode(token);
}