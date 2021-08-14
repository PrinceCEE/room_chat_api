import Router from './router';
import {
  validateCreateRoom,
  isAMember,
  isRoomCreator,
  isRoomExist,
  jwtAuthenticator,
} from '../middlewares';
import {
  getAllRooms,
  createRoom,
  leaveRoom,
  deleteRoom,
  joinRoom,
} from '../controllers';

export default class extends Router {
  path = "/rooms";

  init() {
    this.router.get(
      '/',
      getAllRooms,
    );

    this.router.post(
      '/create-room',
      jwtAuthenticator,
      validateCreateRoom,
      createRoom,
    );

    this.router.post(
      '/:roomName/leave',
      jwtAuthenticator,
      isRoomExist,
      isAMember,
      leaveRoom,
    );

    this.router.post(
      '/:roomName/join',
      jwtAuthenticator,
      isRoomExist,
      isAMember,
      joinRoom,
    );

    this.router.post(
      '/:roomName/delete',
      jwtAuthenticator,
      isRoomExist,
      isRoomCreator,
      deleteRoom,
    );

    return this.router;
  }
}