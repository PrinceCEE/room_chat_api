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

export default class extends Router {
  path = "/auth";

  init() {
    this.router.post(
      '/register',
      registerMiddleware,
      registerController,
    );

    this.router.post(
      '/login',
      loginMiddleware,
      localAuthenticator,
      loginController,
    );

    return this.router;
  }
}