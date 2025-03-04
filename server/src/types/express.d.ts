import { JwtPayload } from "jsonwebtoken";  // Assuming you have JwtPayload defined elsewhere

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;  // You can replace `JwtPayload` with the actual type if different
      admin?:JwtPayload;
    }
  }
}
