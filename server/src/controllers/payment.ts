import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import Payment from "../models/payment.model";
// const shortid = require("shortid");
// const Razorpay = require("razorpay");
import crypto from "crypto";
import mongoose from "mongoose";
import { AccountStatusEnum, PaymentEnum } from "../types/enum";
import User from "../models/user.model";
import bcrypt from "bcrypt";

const createAccountOnSuccessfullPayment = async ({
    email,
    firstName,
    lastName,
    contactNumber,
}: {
    email: string;
    firstName: string;
    lastName: [string]; 
    contactNumber: string;
}) => {
    const existedUser = await User.findOne({ email: email });
    
    if (existedUser) {
        console.log("User already exists...");
        
        // existedUser.accountStatus = AccountStatusEnum.ACTIVE;
        // existedUser.subscriptionStartDate = new Date();
        existedUser.paymentStatus = true;
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
         paymentStatus: true
     });
 
     const createdUser = await User.findById(user._id).select(
         "-password -refreshToken -accessToken"
     );
 
     if (!createdUser) {
         return { statusCode: 500, message: "Payement Verfied but failed to create account" }
     }
 
    //  await sendEmail({
    //      to: createdUser.email,
    //      subject: "CareerGreek Login Credentials",
    //      html: registrationTemplate(email, password, firstName)
    //  });
 
     return { StatusCodes: 201, message: "Payment verified and account created successfully" }
};

// const handleCreateOrder = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { userId } = req.body;

//     const razorpay = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_SECRET,
//     });

//     const amount: number = 5000;

//     const options = {
//         amount: amount,
//         currency: "INR",
//         receipt: `CG_${new Date().getTime()}`,
//         payment_capture: 1,
//     }

//     // creating order
//     const orderedData = await razorpay.orders.create(options);

//     console.log("razorpay response", orderedData);

//     if (orderedData.status !== "created")
//         throw new AppError("Order Creation Error", 410);

//     // creating order in db
//     const payment = await Payment.create({
//         userId: new mongoose.Types.ObjectId(userId),
//         amount,
//         paymentId: "",
//         orderId: orderedData.id,           // replace with order_id
//         razorpaySignature: "",
//         status: PaymentEnum.PENDING
//     });

//     console.log("payment", payment);

//     if (!payment)
//         throw new AppError("Order not created, try agin later", 504);

//     return res.status(200).json({
//         success: true,
//         message: "Payement status successfully",
//         orderedData,
//         // payment
//     })


// }



// const handleVerifyingPayment = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature)
//         throw new AppError("All Fields are required", 404);

//     const payment = await Payment.findOne({ orderId: razorpay_order_id });

//     if (!payment)
//         throw new AppError("Order Not found", 404);

//     const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET ?? "";

//     const generated_signature = crypto
//         .createHmac("sha256", RAZORPAY_SECRET)
//         .update(razorpay_order_id + "|" + razorpay_payment_id)
//         .digest("hex");


//     if (generated_signature === razorpay_signature) {
//         payment.paymentId = razorpay_payment_id,
//             payment.razorpaySignature = razorpay_signature,
//             payment.status = PaymentEnum.COMPLETED

//         const updatedPayemntDoc = await payment.save();

//         return res.status(200).json({
//             success: true,
//             message: "Payment verfied successfully",
//             updatedPayemntDoc
//         })
//     }
//     else {
//         payment.status = PaymentEnum.FAILED;
//         await payment.save();
//         throw new AppError("Payment verrification Failed", 400);
//     }
// }


const handlePaymentWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const webhookSecret: string | null = process.env.RAZORPAY_WEBHOOK_SECRET ?? null;
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    // console.log("paymentDetails", body);

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
    const razorpay_signature = paymentDetails.payload.payment.entity.signature;
    const amount = paymentDetails.payload.payment.entity.amount;
    const contactNumber = paymentDetails.payload.payment.entity.contact;
    const email = paymentDetails.payload.payment.entity.email ?? "";
    const method = paymentDetails.payload.payment.entity.method;


    if (paymentDetails.payload.payment.entity.status === 'captured') {

        const paymenDetails = await Payment.create({
            contactNumber,
            amount,
            method,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            razorpaySignature: razorpay_signature,
            status: PaymentEnum.COMPLETED
        });

        console.log("payment creation details", paymenDetails)

        console.log("entity object", paymentDetails.payload.payment.entity)
        const name = paymentDetails.payload.payment.entity.notes.name ?? "Jinesh Prajapat";
        const [firstName, ...lastName] = name.split(" ");

        console.log("lastName", lastName)

        const { statusCode, message } = await createAccountOnSuccessfullPayment({ email, firstName, lastName, contactNumber })

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