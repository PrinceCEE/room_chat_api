import { Response, Request, NextFunction } from "express";

export interface IResponse {
  success: boolean;
  data: any;
  statusCode?: number;
}

export type Req = Request;
export type Res = Response;
export type Next = NextFunction;