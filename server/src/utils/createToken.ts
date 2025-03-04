import jwt from "jsonwebtoken";
require("dotenv").config();
import { Payload } from "../types/interface";

export const createAccessToken = (payload: Payload) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined in env");
    }
    return jwt.sign(payload, secret, {
        expiresIn: "2h",
    });
};

export const createRefreshToken = (payload: Payload) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined in env");
    }
    return jwt.sign(payload, secret, {
        expiresIn: "7d",
    });
};
