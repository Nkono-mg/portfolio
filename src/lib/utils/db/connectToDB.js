import mongoose from "mongoose";

export async function connectToDB() {
  if (mongoose.connection.readyState) {
    console.log(`Using existing connection: `, mongoose.connection.name);
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO);
    console.log(`Connected to database: `, mongoose.connection.name);
  } catch (error) {
    console.error("❌ Database connection error:", error.message || error);
    throw new Error("Failed to connect to the database. See logs for details.");
  }
}
