import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    trim: true,
    unique: true,
    lowerCase: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});
export const Tag = mongoose.models?.Tag || mongoose.model("Tag", tagSchema);
