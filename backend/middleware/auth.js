import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default function (req, res, next) {
  const token = req.header("userInfo");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send("Invalid token. ");
  }
}
