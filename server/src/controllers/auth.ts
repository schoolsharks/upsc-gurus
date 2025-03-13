import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/createToken";
import { Payload } from "../types/interface";
import crypto from "crypto";

const handleRegisterUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email} = req.body;

    if (
        [email].some(
            (field) => field?.trim() === ""
        )
    ) {
        return next(new AppError("All fields are required", 400));
    }

    const existedUser = await User.findOne({ email: email });

    if (existedUser) {
        return next(
            new AppError("User with email already exists", 400)
        );
    }

    // password generated
    const password = crypto.randomBytes(4).toString("hex");
    console.log("password", password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -accessToken"
    );

    if (!createdUser) {
        return next(
            new AppError("Something went wrong while registering the user", 500)
        );
    }

    return res.status(201).json({
        user: {
            email: createdUser.email,
            userID: createdUser._id
        }
    });
};

const handleLoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    console.log(email, password)

    if (
        [email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        return next(new AppError("All fields are required", 400));
    }


    // if user exist (email)
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Email is not registered", 404));
    }

    // isPassword match
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return next(new AppError("Incorrect password", 403));
    }

    // payload for token
    const payload: Payload = {
        email: user.email,
        id: user._id as string
    }
    
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(201).json({
        accessToken,
        user: {
            email: user.email,
            id: user._id,
            activeTest: user.activeTest ? true : false
        },
    });
}

export {handleRegisterUser,handleLoginUser};