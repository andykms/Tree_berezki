import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import BadRequestError from "../Errors/bad-request-error";
import {
  IS_MOCK,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config";
import { UserModel } from "./Model";
import ms from "../utils/ms";

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const user = await UserModel.getUser(email, password);
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }    
    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ms(ACCESS_TOKEN_EXPIRY),
    });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: ms(REFRESH_TOKEN_EXPIRY),
    });

    await UserModel.addRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(REFRESH_TOKEN_EXPIRY),
      sameSite: "strict",
      secure: false,
    });
    return res.send({ accessToken });
  } catch(error) {
    return next(error);
  }
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  const { password, phone } = req.body;
  try {
    const user = await UserModel.addUser(phone, password);
    return res.send(user);
  } catch(error) {
    return next(error);
  }
}
