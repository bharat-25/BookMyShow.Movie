import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';

const envFilePath = path.resolve(__dirname, '../../.env');
dotenvConfig();

export const config = {
  PORT: process.env.PORT,
  MONGO: {
    MOVIE_DB_NAME: process.env.MOVIE_DB_NAME,
    DB_URL: process.env.DB_URL,
    OPTIONS: {
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
    }}
  }
