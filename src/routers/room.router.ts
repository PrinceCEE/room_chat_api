import Router from './router';
import {
  validateCreateRoom,
  isAMember,
  isRoomCreator,
  jwtAuthenticator,
} from '../middlewares';
import {
  getAllRooms,
  createRoom,
  leaveRoom,
  deleteRoom,
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
      isAMember,
      leaveRoom,
    );

    this.router.post(
      '/:roomName/delete',
      jwtAuthenticator,
      isRoomCreator,
      deleteRoom,
    );

    return this.router;
  }
}