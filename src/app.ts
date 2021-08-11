import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { IResponse, Req, Res, Next } from './interface';
import { loginMiddleware, registerMiddleware } from './middlewares';
import { loginController, registerController } from './controllers';
import { ServerError } from './errors';
import strategies from './strategies';

// initialise the strategies
strategies();
const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("$ecret"));
app.use(passport.initialize());

app.post(
  '/login',
  loginMiddleware,
  loginController
);

app.post(
  '/register',
  registerMiddleware,
  registerController
);

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