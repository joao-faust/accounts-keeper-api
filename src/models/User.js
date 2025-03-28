import mongoose from "mongoose";
import { accountSchema } from "./Account.js";

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    accounts: [accountSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
