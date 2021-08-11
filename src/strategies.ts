import { use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export default () => {
  // setup the local passport authenticator
  use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
  }, (username, password, done) => {
    // implement the strategy
  }));

  // setup the jwt passport authenticator
  use(new JwtStrategy({
    secretOrKey: "$ecret",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, (payload, done) => {
    // Implement the strategy
  }));
}