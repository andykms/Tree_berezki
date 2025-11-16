import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const ORIGIN_PATH = process.env.ORIGIN_PATH || 'http://localhost:3000';
export const SERVER_PATH = process.env.SERVER_PATH || 'http://localhost:6768';
export const IS_MOCK = process.env.IS_MOCK === 'true';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
if(!ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined');
}
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";
if(!REFRESH_TOKEN_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET is not defined');
}
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1d";
if(!ACCESS_TOKEN_EXPIRY) {
  throw new Error('ACCESS_TOKEN_EXPIRY is not defined');
}
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "30d";
if(!REFRESH_TOKEN_EXPIRY) {
  throw new Error('REFRESH_TOKEN_EXPIRY is not defined');
}