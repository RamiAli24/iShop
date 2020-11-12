import bcrypt from "bcrypt";
import _ from "lodash";
import User from "../models/user.js";
import express from "express";
const router = express.Router();

//  @desc logging user
// @route  POST  /api/login
//  @access  Public
router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

export default router;
