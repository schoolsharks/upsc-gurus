import { Schema, model, Document } from "mongoose";
import { PaymentEnum } from "../types/enum";

interface PaymentType extends Document {
    userId: Schema.Types.ObjectId;
    packageId: Schema.Types.ObjectId;
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
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        packageId: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true,
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
            type: String,
            enum: Object.values(PaymentEnum),
            required: true,
        },
    },
    { timestamps: true }
);

const Payment = model<PaymentType>("Payment", paymentSchema);
export default Payment;
