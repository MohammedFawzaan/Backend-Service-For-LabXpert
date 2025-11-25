import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from "passport";
import cookieParser from 'cookie-parser';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectMongoDb from './db/mongodb.js';
import userModel from './models/user.model.js';
import userRoutes from './routes/user.routes.js';
import sampleRoutes from './routes/sample.routes.js';
import recipeRoutes from './routes/recipe.routes.js';

dotenv.config();

const app = express();

connectMongoDb();

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await userModel.create({
            googleId: profile.id,
            firstname: profile.name.givenName || "",
            lastname: profile.name.familyName || "",
            email: profile.emails[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Hello
app.use('/api', userRoutes);
app.use('/api', sampleRoutes);
app.use('/api', recipeRoutes);

export default app;