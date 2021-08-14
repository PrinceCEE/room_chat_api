import { UpdateDto } from "../dtos";
import { BadrequestError } from "../errors";
import { Req, Res, Next, IUser } from "../interface";
import userService from "../services/user.service";
import { UpdateValidator } from "../validators";

export const isUserExist = async (req: Req, res: Res, next: Next) => {
  const { username } = req.params,
    user = await userService.getUserByusername(username);
  if(!user) {
    return next(new BadrequestError(`${username} doesn't exist`));
  }
  next();
}

export const validateUpdate = async (req: Req, res: Res, next: Next) => {
  const body: UpdateDto = req.body,
    user = req.user as IUser,
    { error } = UpdateValidator.validate(body);
  
  if(error) {
    return next(new BadrequestError(error.message));
  }

  if(body.username) {
    let sUser = await userService.getUserByusername(body.username);
    if(sUser) return next(new BadrequestError(`${body.username} already exists, choose another username`));
  }
  next();
}