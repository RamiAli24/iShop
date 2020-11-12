import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// with mongoose we could add timestamps as a second argument and it will automatically add time stamps for creation and updating

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, name: this.name },
    process.env.JWT_SECRET
  );
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
