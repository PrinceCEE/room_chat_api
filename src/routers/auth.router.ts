import Router from './router';
import {
  registerMiddleware,
  loginMiddleware,
  localAuthenticator,
} from '../middlewares';
import {
  registerController,
  loginController
} from '../controllers';
import { asyncHandler } from '../utils';

export default class extends Router {
  path = "/auth";

  init() {
    this.router.post(
      '/register',
      asyncHandler(registerMiddleware),
      asyncHandler(registerController),
    );

    this.router.post(
      '/login',
      asyncHandler(loginMiddleware),
      asyncHandler(localAuthenticator),
      asyncHandler(loginController),
    );

    return this.router;
  }
}