/* @flow */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import PrettyError from 'pretty-error';
// import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import passport from './passport';
import config from './config';
// import logger from './logger';
import router from './router';

const app = express();

// app.use(morgan('combined', { stream: logger.stream }));

app.set('trust proxy', 'loopback');

app.use(
  cors({
    origin(origin, next) {
      const whitelist = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : [];
      next(null, whitelist.includes(origin));
    },
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    getToken: req => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      }
      return undefined;
    },
  }).unless({ path: [`/`, `/cat/login`, `/cat/register`] }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.log('[express-jwt-error]', req.headers.authorization.split(' ')[1]);
    res.status(401).send('Invalid token');
  }
  next(err);
});

app.post(
  '/cat/login',
  passport.authenticate('local', { session: false }),
  async (req, res) => {
    const token = await jwt.sign(
      {
        username: req.user.username,
      },
      config.auth.jwt.secret,
    );
    res.json({
      token,
    });
  },
);

// -----------------------------------------------------------------------------

app.use(router);

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');
pe.withoutColors(); // So that logfile output is clean.
pe.start(); // Ensures that PrettyError is used app-wide.

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
