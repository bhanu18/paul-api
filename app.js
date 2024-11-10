import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from 'morgan';
import * as dotenv from "dotenv";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import UserRoutes from './routes/users.js'
import cookieParser from 'cookie-parser';

import passportConfig from './config/passport.js';
import passport from 'passport';

(passportConfig)(passport);

dotenv.config();

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(cookieParser('keyboardcat'));

// Express Session
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_CONNECTION_STRING }),
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/orders', orderRoutes);

app.use('/auth', UserRoutes);

// morgan
app.use(logger('dev'));

const PORT = process.env.PORT || 5000;

const appconnect = async () => {
  try {

    app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`));

  } catch (error) {
    console.log(error)
  }
}

appconnect();