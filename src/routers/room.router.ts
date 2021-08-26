import Router from "./router";
import {
  validateCreateRoom,
  isAMember,
  isRoomCreator,
  isRoomExist,
  jwtAuthenticator,
} from "../middlewares";
import {
  getAllRooms,
  createRoom,
  leaveRoom,
  deleteRoom,
  joinRoom,
} from "../controllers";
import { asyncHandler } from "../utils";

export default class extends Router {
  path = "/rooms";

  init() {
    this.router.get("/", asyncHandler(getAllRooms));

    this.router.post(
      "/create-room",
      asyncHandler(jwtAuthenticator),
      asyncHandler(validateCreateRoom),
      asyncHandler(createRoom),
    );

    this.router.post(
      "/:roomName/leave",
      asyncHandler(jwtAuthenticator),
      asyncHandler(isRoomExist),
      asyncHandler(isAMember),
      asyncHandler(leaveRoom),
    );

    this.router.post(
      "/:roomName/join",
      asyncHandler(jwtAuthenticator),
      asyncHandler(isRoomExist),
      asyncHandler(isAMember),
      asyncHandler(joinRoom),
    );

    this.router.post(
      "/:roomName/delete",
      asyncHandler(jwtAuthenticator),
      asyncHandler(isRoomExist),
      asyncHandler(isRoomCreator),
      asyncHandler(deleteRoom),
    );

    return this.router;
  }
}
