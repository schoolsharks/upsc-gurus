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
    console.log('\n====== NEW WEBHOOK REQUEST RECEIVED ======');
    console.log('Timestamp:', new Date().toISOString());
    
    // Log all headers for debugging
    console.log('\n=== REQUEST HEADERS ===');
    console.dir(req.headers, { depth: null, colors: true });

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    console.log('\n=== WEBHOOK SECRET ===');
    console.log('Secret exists:', !!webhookSecret);
    console.log('Secret length:', webhookSecret?.length || 0);

    // Get the EXACT raw body that was sent by Razorpay
    const rawBody = (req as any).rawBody ? (req as any).rawBody.toString('utf8') : req.body.toString('utf8');
    
    console.log('\n=== RAW REQUEST BODY ===');
    console.log(rawBody);

    // Case-insensitive header access
    const razorpaySignature = 
      req.headers['x-razorpay-signature'] || 
      req.headers['X-Razorpay-Signature'];
    
    console.log('\n=== SIGNATURE VERIFICATION ===');
    console.log('Received signature:', razorpaySignature);
    console.log('Signature type:', typeof razorpaySignature);

    if (!razorpaySignature || typeof razorpaySignature !== 'string') {
      console.error('❌ ERROR: Missing or invalid signature header');
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid Razorpay signature header',
      });
    }

    if (!webhookSecret) {
      console.error('❌ ERROR: Webhook secret not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error - missing webhook secret',
      });
    }

    console.log('\nGenerating signature comparison...');
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    console.log('Generated signature:', generatedSignature);
    console.log('Signature length:', generatedSignature.length);
    console.log('Received length:', razorpaySignature.length);

    // Secure comparison
    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature)
    );

    if (!signatureValid) {
      console.error('\n❌ SIGNATURE VALIDATION FAILED ❌');
      console.error('Possible causes:');
      console.error('- Webhook secret mismatch');
      console.error('- Request body was modified');
      console.error('- Incorrect signature generation');
      
      console.log('\n=== DIFF ANALYSIS ===');
      console.log('First 10 chars of received:', razorpaySignature.substring(0, 10));
      console.log('First 10 chars of generated:', generatedSignature.substring(0, 10));
      
      return res.status(401).json({
        success: false,
        message: 'Invalid signature',
      });
    }
    console.log('\n✅ SIGNATURE VALIDATION SUCCESSFUL ✅');
    
    // Process payment details
    const paymentDetails = req.body;
    console.log('\n=== PAYMENT DETAILS ===');
    console.dir(paymentDetails, { depth: null, colors: true });

    if (!paymentDetails.payload?.payment?.entity) {
      console.error('❌ Invalid payment data structure');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment data structure',
      });
    }

    const entity = paymentDetails.payload.payment.entity;
    console.log('\n=== ENTITY DETAILS ===');
    console.log('Payment ID:', entity.id);
    console.log('Status:', entity.status);
    console.log('Amount:', entity.amount);
    console.log('Email:', entity.email);
    console.log('Notes:', entity.notes);

    const razorpay_payment_id = entity.id;
    const razorpay_order_id = entity.order_id;
    const amount = entity.amount;
    const contactNumber = entity.contact;
    const email = entity.notes?.email || entity.email || '';
    const method = entity.method;
    const packageName = entity.notes?.package;
    const noOfAttempts = entity.notes?.no_of_attempts_taken_at_upsc;
    const optionalSubject = entity.notes?.optional_subject;
    const city = entity.notes?.city;

    console.log('\n=== EXTRACTED PAYMENT DATA ===');
    console.log('Package Name:', packageName);
    console.log('Email:', email);
    console.log('Contact:', contactNumber);
    console.log('No. of Attempts:', noOfAttempts);
    console.log('Optional Subject:', optionalSubject);
    console.log('City:', city);

    if (!packageName) {
      console.error('❌ Package name is required');
      return res.status(400).json({
        success: false,
        message: 'Package name is required',
      });
    }

    if (!email) {
      console.error('❌ Email is required');
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const userEmail = entity.email || email;

    let packageId;
    try {
      console.log('\n=== LOOKING UP PACKAGE ID ===');
      packageId = await getIdFromName(packageName);
      console.log('Found package ID:', packageId);
    } catch (error) {
      console.error('❌ Package lookup failed:', error);
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    if (entity.status === 'captured') {
      console.log('\n💰 PAYMENT CAPTURED - PROCESSING...');
      
      // Create payment record
      console.log('Creating payment record...');
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

      const name = entity.notes?.name ?? 'Jinesh Prajapat';
      const [firstName, ...lastName] = name.split(' ');

      console.log('\n=== CREATING USER ACCOUNT ===');
      console.log('Name:', name);
      console.log('First Name:', firstName);
      console.log('Last Name:', lastName.join(' '));

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

      console.log('\n=== ACCOUNT CREATION RESULT ===');
      console.log('Status Code:', statusCode);
      console.log('Message:', message);

      return res.status(Number(statusCode)).json({
        success: statusCode === 200 || statusCode === 201 ? true : false,
        message: message,
      });
    } else {
      console.log('\n⚠️ PAYMENT NOT CAPTURED - STATUS:', entity.status);
      return res.status(402).json({
        success: false,
        message: 'Payment not verified',
      });
    }
  } catch (error) {
    console.error('\n❌❌❌ UNHANDLED ERROR IN WEBHOOK ❌❌❌');
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { handlePaymentWebhook };
