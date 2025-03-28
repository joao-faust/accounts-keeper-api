import mongoose from "mongoose";

export const accountSchema = new mongoose.Schema({
  username: String,
  password: String,
  iv: String
});
