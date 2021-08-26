import Router from "./router";
import { jwtAuthenticator, isUserExist, validateUpdate } from "../middlewares";
import {
  myProfile,
  getUserProfile,
  updateMyProfile,
  getMyRooms,
} from "../controllers";
import { asyncHandler } from "../utils";

export default class extends Router {
  path = "/user";

  init() {
    // user's profile
    this.router.get(
      "/profile",
      asyncHandler(jwtAuthenticator),
      asyncHandler(myProfile),
    );

    // guest profile
    this.router.get(
      "/:username",
      asyncHandler(jwtAuthenticator),
      asyncHandler(isUserExist),
      asyncHandler(getUserProfile),
    );

    // user update profile
    this.router.post(
      "/update-account",
      asyncHandler(jwtAuthenticator),
      asyncHandler(validateUpdate),
      asyncHandler(updateMyProfile),
    );

    // rooms joined by the user
    this.router.post(
      "/:username/rooms",
      asyncHandler(jwtAuthenticator),
      asyncHandler(isUserExist),
      asyncHandler(getMyRooms),
    );

    return this.router;
  }
}
