import { CreateRoomDto } from '../dtos';
import { BadrequestError, UnauthorisedError } from '../errors';
import { Next, Req, Res, IUser } from '../interface';
import roomService from '../services/room.service';
import { CreateRoomValidator } from '../validators';

export const validateCreateRoom = async (req: Req, res: Res, next: Next) => {
  const body: CreateRoomDto = req.body,
    { error } = CreateRoomValidator.validate(body);
  
  if(error) {
    return next(new BadrequestError(error.message));
  }

  if(await roomService.getRoom(body.name)) {
    return next(new BadrequestError(`${body.name} is already taken, choose another one`));
  }
  
  next();
}

export const isRoomExist = async (req: Req, res: Res, next: Next) => {
  const { roomName } = req.params;
  if(!await roomService.getRoom(roomName)) {
    return next(new BadrequestError(`${roomName} doesn't exist`));
  }

  next();
}

export const isAMember = async (req: Req, res: Res, next: Next) => {
  const { roomName } = req.params,
    user = req.user as IUser,
    isAMember = await roomService.isAMember(roomName, user.id),
    urlParams = req.url.split('/'),
    type = urlParams[urlParams.length -1] as "leave" | "join";
  
  switch(type) {
    case "leave":
      if(!isAMember) {
        return next(new BadrequestError(`You are not a member of ${roomName}`));
      }
      break;
    case "join":
      if(isAMember) {
        return next(new BadrequestError(`You are a member of ${roomName} already`));
      }
      break;
  }

  next();
}

export const isRoomCreator = async (req: Req, res: Res, next: Next) => {
  const { roomName } = req.params,
    user = req.user as IUser;

  if(!roomService.isCreator(roomName, user.username)) {
    return next(new UnauthorisedError("Sorry, you are not authorised to delete the room"));
  }

  next();
}