import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/rajdb");

const userSchema = mongoose.Schema({
  image: String,
  email: String,
  name: String,
});

export const user = mongoose.model("user", userSchema);
