import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    profilePicUrl: { type: String },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleSub: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
