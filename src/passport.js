import passport from 'passport';
import passportlocal from 'passport-local';
// import logger from './logger';

import { login, update } from './db/catsController';

const { Strategy: LocalStrategy } = passportlocal;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log('Entering passport strategy');
    try {
      const user = await login(username);
      if (!user) {
        console.log(`Unable to find user`);
        return done(null, false);
      }
      if (user.password !== password) {
        console.log(`Password did not match`);
        return done(null, false);
      }
      console.log(`User authenticated`);
      const updatedUser = {
        username: user.username,
        lastSeenAt: new Date(),
      };
      await update(updatedUser);
      return done(null, user);
    } catch (err) {
      console.log(`Error trying to authenticate user`);
      return done(err);
    }
  }),
);

export default passport;
