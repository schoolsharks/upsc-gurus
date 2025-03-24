import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import Payment from "../models/payment.model";
import crypto from "crypto";
import { AccountStatusEnum, PaymentEnum } from "../types/enum";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import Package from "../models/package.model";
import { Schema } from "mongoose";
import { sendEmail } from "../utils/awsMailSender";
import { registrationTemplate } from "../mails/registrationTemplate";

// sendEmail({
//     to: "manish.piclet@gmail.com",
//     subject: "UPSC Gurus Login Credentials",
//     html: registrationTemplate("manishbulchandani4@gmail.com", "password", "Manish"),
//   });

const createAccountOnSuccessfullPayment = async ({
  email,
  firstName,
  lastName,
  contactNumber,
  packageId,
  noOfAttempts,
  optionalSubject,
  city,
}: {
  email: string;
  firstName: string;
  lastName: string[];
  contactNumber: string;
  packageId: Schema.Types.ObjectId;
  noOfAttempts?: number;
  optionalSubject?: string;
  city?: string;
}) => {
  try {
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      existedUser.paymentStatus = true;
      if (!existedUser.purchasedPackages.includes(packageId)) {
        existedUser.purchasedPackages.push(packageId);
      }

      await existedUser.save();

      return {
        statusCode: 200,
        message: "Payment verified and account updated successfully",
      };
    }

    const password = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      firstName: firstName.trim(),
      lastName: lastName.join(" "),
      contactNumber: contactNumber.replace(/\s+/g, ""),
      password: hashedPassword,
      accountStatus: AccountStatusEnum.ACTIVE,
      subscriptionStartDate: new Date(),
      paymentStatus: true,
      purchasedPackages: [packageId],
      noOfAttempts: noOfAttempts || 0,
      optionalSubject: optionalSubject || "",
      city: city || "",
    });

    const response = await sendEmail({
      to: user.email,
      subject: "UPSC Gurus Login Credentials",
      html: registrationTemplate(email, password, firstName),
    });
    console.log("Mail response", response);

    return {
      statusCode: 201,
      message: "Payment verified and account created successfully.",
    };
  } catch (error) {
    console.error("Error in createAccountOnSuccessfullPayment:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

async function getIdFromName(name: string): Promise<Schema.Types.ObjectId> {
  const coursePackage = await Package.findOne({ name: name });
  if (coursePackage) {
    return coursePackage._id;
  } else {
    throw new AppError("Package not found", 404);
  }
}

const handlePaymentWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Webhook triggered");
    const webhookSecret: string | null =
      process.env.RAZORPAY_WEBHOOK_SECRET ?? null;
    const razorpaySignature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    if (!razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay signature",
      });
    }

    if (webhookSecret) {
      const generatedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        console.log("Invalid Signature");
        return res.status(401).json({
          success: false,
          message: "Invalid signature",
        });
      }
    }

    const paymentDetails = req.body;
    console.log("Payment details received from webhook:");
    console.dir(paymentDetails, { depth: null });

    if (!paymentDetails.payload?.payment?.entity) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment data structure",
      });
    }

    const entity = paymentDetails.payload.payment.entity;

    const razorpay_payment_id = entity.id;
    const razorpay_order_id = entity.order_id;
    const amount = entity.amount;
    const contactNumber = entity.contact;
    const email = entity.notes?.email || entity.email || "";
    const method = entity.method;
    const packageName = entity.notes?.package;
    const noOfAttempts=entity.notes?.no_of_attempts_taken_at_upsc;
    const optionalSubject=entity.notes?.optional_subject;
    const city=entity.notes?.city;


    if (!packageName) {
      return res.status(400).json({
        success: false,
        message: "Package name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userEmail = entity.email || email;

    let packageId;
    try {
      packageId = await getIdFromName(packageName);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    if (entity.status === "captured") {
      await Payment.create({
        contactNumber,
        amount,
        method,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: PaymentEnum.COMPLETED,
        purchasedPackage: packageId,
        userEmail: userEmail,
      });

      const name = entity.notes?.name ?? "Jinesh Prajapat";
      const [firstName, ...lastName] = name.split(" ");

      const { statusCode, message } = await createAccountOnSuccessfullPayment({
        email,
        firstName,
        lastName,
        contactNumber,
        packageId,
        noOfAttempts,
        optionalSubject,
        city,
      });

      return res.status(Number(statusCode)).json({
        success: statusCode === 200 || statusCode === 201 ? true : false,
        message: message,
      });
    } else {
      return res.status(402).json({
        success: false,
        message: "Payment not verified",
      });
    }
  } catch (error) {
    console.error("Error in handlePaymentWebhook:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { handlePaymentWebhook };
