import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import Payment from "../models/payment.model";
const shortid = require("shortid");
const Razorpay = require("razorpay");
import crypto from "crypto";
import mongoose from "mongoose";
import { AccountStatusEnum, PaymentEnum,PackageEnum } from "../types/enum";
import { sendEmail } from "../utils/awsMailSender";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import Package from "../models/package.model";

const createAccountOnSuccessfullPayment = async ({
    email,
    firstName,
    lastName,
    contactNumber,
    packageId
    }: {
        email: string;
        firstName: string;
        lastName: [string]; 
        contactNumber: string;
        packageId: string;
    }) => {
    const existedUser = await User.findOne({ email: email });

    
    if (existedUser) {
        console.log("User already exists...");
        
        existedUser.paymentStatus = true;
        existedUser.purchasedPackages = [packageId];

        await existedUser.save();

       
        // await sendEmail({
        //     to: email,
        //     subject: "Payment Verified | Access Granted",
        //     html: paymentVerifiedTemplate(email, `${firstName} ${lastName}`)
        // });

        console.log("Activated account:", existedUser);
        return { statusCode: 200, message: "Payment verified and account updated to active mode" };
    }

     // password generated
     const password = crypto.randomBytes(4).toString("hex");
     const hashedPassword = await bcrypt.hash(password, 10);
 
     console.log("creating new account.....", lastName);
 
     console.log("on spliting", lastName ? (lastName.join(" ") ?? "") : "")
 
     const user = await User.create({
         email,
         firstName: firstName.split(" ")[0] ?? "",
         lastName: lastName ? (lastName.join(" ") ?? "") : "",
         contactNumber: contactNumber.split(" ")[0],
         password: hashedPassword,
         accountStatus: AccountStatusEnum.ACTIVE,
         subscriptionStartDate: new Date(),
         paymentStatus: true,
         purchasedPackages : [packageId]
     });
     const createdUser = await User.findById(user._id).select(
         "-password -refreshToken -accessToken"
     );
     console.log("New User", createdUser);
 
     if (!createdUser) {
         return { statusCode: 500, message: "Payement Verfied but failed to create account" }
     }
     console.log("New User Purchased package", createdUser.purchasedPackages);
    //  await sendEmail({
    //      to: createdUser.email,
    //      subject: "CareerGreek Login Credentials",
    //      html: registrationTemplate(email, password, firstName)
    //  });
 
     return { statusCode: 201, message: "Payment verified and account created successfully" }
};


function getIdFromName(enumObj: Record<string, string>, name: string): string | undefined {
    return Object.entries(enumObj).find(([_, value]) => value === name)?.[0];
}


const handlePaymentWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const webhookSecret: string | null = process.env.RAZORPAY_WEBHOOK_SECRET ?? null;
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    console.log("paymentDetails", body);

    if (webhookSecret) {
        const generatedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            throw new AppError("Invalid Signature", 404);
        }
    }

    // Extract payment details from the Razorpay webhook payload
    const paymentDetails = req.body;
    console.log("___payment details___")
    console.dir(paymentDetails, { depth: null });
    console.log("___payment details___")

    const razorpay_payment_id = paymentDetails.payload.payment.entity.id;
    const razorpay_order_id = paymentDetails.payload.payment.entity.order_id;
    const amount = paymentDetails.payload.payment.entity.amount;
    const contactNumber = paymentDetails.payload.payment.entity.contact;
    const email = paymentDetails.payload.payment.entity.notes.email ?? "";
    const method = paymentDetails.payload.payment.entity.method;
    const packageName = paymentDetails.payload.payment.entity.notes.package;
    const paymentRecord = await Payment.findOne({ orderId: razorpay_order_id });
    const userEmail = paymentDetails.payload.payment.entity.email;
    
    const packageId = getIdFromName(PackageEnum, packageName) ?? "";

    console.log("packageId", packageId);

    if (paymentDetails.payload.payment.entity.status === 'captured') {

        const paymenDetails = await Payment.create({
            contactNumber,
            amount,
            method,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: PaymentEnum.COMPLETED,
            purchasedPackage: packageId,
            userEmail: userEmail
        });

        console.log("payment creation details", paymentDetails)

        console.log("entity object", paymentDetails.payload.payment.entity)
        const name = paymentDetails.payload.payment.entity.notes.name ?? "Jinesh Prajapat";
        const [firstName, ...lastName] = name.split(" ");

        console.log("lastName", lastName)

        const { statusCode, message } = await createAccountOnSuccessfullPayment({ email, firstName, lastName, contactNumber, packageId })
        console.log("statusCode", statusCode);
        return res.status(Number(statusCode)).json({
            success: (statusCode === 200 || statusCode === 201) ? true : false,
            message: message,
        });
    }
    else {
        return res.status(402).json({
            success: true,
            message: "Payment not verfied",
        })
    }
}

export { handlePaymentWebhook };