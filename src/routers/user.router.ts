import Router from "./router";
import {
  jwtAuthenticator,
  isUserExist,
  validateUpdate,
} from '../middlewares';
import {
  myProfile,
  getUserProfile,
  updateMyProfile,
  getMyRooms,
} from '../controllers';

export default class extends Router {
  path = "/user";
  
  init() {
    this.router.get(
      '/profile',
      jwtAuthenticator,
      myProfile,
    );

    this.router.get(
      '/:username',
      jwtAuthenticator,
      isUserExist,
      getUserProfile,
    );
    this.router.post(
      '/update-account',
      jwtAuthenticator,
      validateUpdate,
      updateMyProfile,
    );

    this.router.post(
      '/:username/rooms',
      jwtAuthenticator,
      isUserExist,
      getMyRooms,
    );

    return this.router;
  }
}