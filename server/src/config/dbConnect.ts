import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/", {
            dbName: "upscgurus",
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit process with failure
    }
};

export default dbConnect;
