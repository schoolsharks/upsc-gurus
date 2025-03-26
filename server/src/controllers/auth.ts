import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/createToken";
import { Payload } from "../types/interface";
import crypto from "crypto";
import { sendEmail } from "../utils/awsMailSender";
import { resetPasswordTemplate } from "../mails/resetPasswordTemplate";
import { passwordResetConfirmationTemplate } from "../mails/passwordResetConfirmationTemplate";

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


const handleResetPasswordToken = async (req: Request,
    res: Response,
    next: NextFunction
) => {

    const { email } = req.body;

    if (!email)
        throw new AppError("Email not found", 404);

    const user = await User.findOne({ email: email });
    if (!user)
        throw new AppError("Email is not registered", 401);

    const resetPasswordToken = crypto.randomUUID();

    const updatedUser = await User.findOneAndUpdate(
        { email: email },
        {
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: Date.now() + 10 * 60 * 1000,
        },
        { new: true }
    );

    const baseURL = process.env.FRONTEND_BASE_URL;
    const url: string = `${baseURL}/reset-password/${resetPasswordToken}`;

    console.log("url:", url);
    if (!updatedUser)
        throw new AppError("Database operation error", 501);

    await sendEmail({
        to: email,
        subject: "UPSC Gurus Reset Password Link",
        html: resetPasswordTemplate(email, user.name, url)
    });

    // const emailInfo = await mailSender(email, 'CareerGreek Reset Password', resetPasswordTemplate(email, user.firstName, url))
    // if (!emailInfo) {
    //     return next(
    //         new AppError("Something went wrong while sending mail", 500)
    //     );
    // }

    return res.status(200).json({
        success: true,
        message: "Reset Passwprd link is sended on registered email",

    })


}

const handleResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword || !token)
        throw new AppError("Field not found", 404);

    if (password !== confirmPassword)
        throw new AppError("Password did'nt match", 401);

    const userDetail = await User.findOne({ resetPasswordToken: token });
    if (!userDetail)
        throw new AppError("User not found", 404);

    if (userDetail.resetPasswordExpires.getTime() < Date.now())
        throw new AppError("Link is expired, try again", 402);

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
        { resetPasswordToken: token },
        {
            password: hashedPassword,
            resetPasswordToken: null
        },
        { new: true }
    );

    if (!updatedUser)
        throw new AppError("Failed to update Password", 410);

    await sendEmail({
        to: userDetail.email,
        subject: "Password Changed",
        html: passwordResetConfirmationTemplate(userDetail.email, userDetail.name, password)
    });


    // // sending mail to updating password
    // const emailInfo = await mailSender(userDetail.email, 'Password Changed', passwordResetConfirmationTemplate(userDetail.email, userDetail.firstName, password))
    // if (!emailInfo) {
    //     return next(
    //         new AppError("Something went wrong while sending mail", 500)
    //     );
    // }

    return res.status(200).json({
        success: true,
        message: "Password updated successfuly"
    })
}

export {handleRegisterUser,handleLoginUser,handleResetPassword,handleResetPasswordToken};