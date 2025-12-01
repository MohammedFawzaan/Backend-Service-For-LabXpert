import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    required: true,
  },
  role: { type: String, enum: ["student", "admin"], default: null },
  credits: {
    type: Number,
    default: 5,
  },
  socketId: {
    type: String,
  },
});

const userModel = mongoose.model('userModel', userSchema);

export default userModel;