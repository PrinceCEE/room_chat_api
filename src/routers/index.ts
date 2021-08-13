import AuthRouter from './auth.router';
import UserRouter from './user.router';
import RoomRouter from './room.router';

export default {
  authRouter: new AuthRouter(),
  userRouter: new UserRouter(),
  roomRouter: new RoomRouter()
}