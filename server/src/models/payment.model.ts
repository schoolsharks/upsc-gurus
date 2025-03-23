import { Schema, model, Document } from "mongoose";
import { PackageEnum, PaymentEnum } from "../types/enum";

interface PaymentType extends Document {
    userEmail: string;
    purchasedPackage: string;
    contactNumber: string;
    amount: number;
    paymentId: string;
    orderId: string;
    method: string;
    razorpaySignature: string;
    status: PaymentEnum;
}

const paymentSchema = new Schema<PaymentType>(
    {
        userEmail: {
            type: String,
            required: true,
        },
        purchasedPackage: {
            type: String,
        },
        contactNumber: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentId: {
            type: String,
        },
        orderId: {
            type: String,
        },
        method: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        status: {
            type: String
        },
    },
    { timestamps: true }
);

const Payment = model<PaymentType>("Payment", paymentSchema);
export default Payment;
