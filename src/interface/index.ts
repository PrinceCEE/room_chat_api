import { Response, Request, NextFunction, Router } from "express";
import { Document } from 'mongoose';

export interface IResponse {
  success: boolean;
  data: any;
  statusCode?: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

export interface IRoom extends Document {
  name: string;
  members: any[];
  [key: string]: any;
}

export type Req = Request;
export type Res = Response;
export type Next = NextFunction;