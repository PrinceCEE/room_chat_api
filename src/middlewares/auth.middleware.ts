import { authenticate } from 'passport';
import { Req, Res, Next, IUser } from '../interface';
import { RegisterDto, LoginDto } from '../dtos';
import { RegisterValidator, LoginValidator } from '../validators';
import { BadrequestError, InternalServerError } from '../errors';
import userService from '../services/user.service';

export const registerMiddleware = async (req: Req, res: Res, next: Next) => {
  const body: RegisterDto = req.body;
  const { error } = RegisterValidator.validate(body);
  if(error) return next(new BadrequestError(error.message));

  if(await userService.getUserByusername(body.username)) {
    return next(new BadrequestError(`${body.username} is already taken, choose another one`));
  }
  
  next();
};

export const localAuthenticator = (req: Req, res: Res, next: Next) => {
  authenticate(
    'local',
    { session: false },
    (err, user: IUser, info: { message: string }) => {
      if(err) {
        return next(new BadrequestError(err.message));
      }

      if(!user) {
        return next(new BadrequestError(info.message));
      }

      req.login(user, err => {
        if(err) return next(new InternalServerError(err.message));
        next();
      });

  })(req, res, next);
};

export const jwtAuthenticator = (req: Req, res: Res, next: Next) => {
  authenticate('jwt', (err, user: IUser, info: { message: string }) => {
    if(err) {
      return next(new InternalServerError(err.message));
    }

    if(!user) {
      return next(new BadrequestError(info.message));
    }

    req.login(user, err => {
      if(err) return next(new InternalServerError(err.message));
      next();
    })
  })(req, res, next);
};

export const loginMiddleware = (req: Req, res: Res, next: Next) => {
  const body: LoginDto = req.body;
  const { error } = LoginValidator.validate(body);
  if(error) {
    return next(new BadrequestError(error.message));
  }
  next();
};