import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    normalizedUserName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    /*isAdmin: {
    type: Boolean,
    default: false,
  },*/
  },
  { timestamps: true }
);
export const User = mongoose.models?.User || mongoose.model("User", userShema);
