import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import { JwtPayload } from "../types/interface";
import User from "../models/user.model";

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const access_Token =
      req.cookies["accessToken"] ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!access_Token) {
      return next(new AppError("Token must be provided", 401));
    }

    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(
        access_Token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return next(
          new AppError(
            "Access token has expired. Please refresh your token.",
            401
          )
        );
      }
      return next(new AppError("Invalid access token", 401));
    }

    if (!decoded) {
      return next(new AppError("Token verification failed", 401));
    }

    const currentUser = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error in authHandler middleware:", err);
    next(
      new AppError("An unexpected error occurred during authentication", 500)
    );
  }
};
