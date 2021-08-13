import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { IResponse, Req, Res, Next } from './interface';
import routers from './routers';
import { ServerError } from './errors';
import strategies from './strategies';

// initialise the strategies
strategies();
const app = express();
const { authRouter, userRouter, roomRouter } = routers;

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("$ecret"));
app.use(passport.initialize());

// Link the routers to the app
app.use(authRouter.path, authRouter.init());
app.use(userRouter.path, userRouter.init());
app.use(roomRouter.path, roomRouter.init());

// error handler
app.use((err: ServerError, req: Req, res: Res, next: Next) => {
  let response: IResponse = {
    success: false,
    data: err.message,
  };

  response.statusCode = err instanceof ServerError
    ? err.statusCode
    : 500;
  
  res.status(response.statusCode).json(response);
});

// 404 handler
app.use((req: Req, res: Res) => {
  const response: IResponse = {
    success: false,
    statusCode: 404,
    data: "Not found"
  };
  res.status(response.statusCode as number).json(response);
});

export default app;