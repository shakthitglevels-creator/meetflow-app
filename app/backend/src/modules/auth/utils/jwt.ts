// import jwt from "jsonwebtoken";
// import { env } from "../../../config/env";

// // store the data inside jwt payload 
// type TokenPayload = {
//   userId: string;
//   role: string
// }

// // creates short-lived access token 
// export const generateAccessToken = (payload: TokenPayload): string => {
//   return jwt.sign(
//     payload,
//     env.JWT_ACCESS_SECRET,
//     {
//       expiresIn: env.JWT_ACCESS_EXPIRES_IN
//     }
//   )
// }

// // create long-lived refresh token 
// export const generateRefreshToken = (payload: TokenPayload) => {
//   return jwt.sign(
//     payload,
//     env.JWT_REFRESH_SECRET,
//     {
//       expiresIn: env.JWT_REFRESH_EXPIRES_IN 
//     }
//   )
// }

// export const verifyAccessToken = (token: string) => {
//   return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload
// }

// // Verifies refresh token and returns decoded payload
// export const verifyRefreshToken = (token: string) => {
//   return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
// };

import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../../config/env";

type TokenPayload = {
  userId: string;
  role: string;
};

// creates short-lived access token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

// creates long-lived refresh token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};