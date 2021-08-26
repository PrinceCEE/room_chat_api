import { use } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userService from "./services/user.service";
import { IJwtPayload } from "./interface";

export default () => {
  // setup the local passport authenticator
  use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await userService.getUserByusername(username);
          if (!user) {
            return done(null, false, {
              message: `${username} not registered`,
            });
          }

          const isPwdValid = await userService.comparePassword(
            password,
            user.password
          );
          if (!isPwdValid) {
            return done(null, false, {
              message: "Invalid log in details",
            });
          }

          done(null, user);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  // setup the jwt passport authenticator
  use(
    new JwtStrategy(
      {
        secretOrKey: "$ecret",
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (payload, done) => {
        try {
          payload = payload as IJwtPayload;
          const user = await userService.getUserByusername(payload.username);
          if (!user) {
            return done(null, false, {
              message: "Invalid access token",
            });
          }
          done(null, user);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
};
