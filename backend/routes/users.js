import auth from "../middleware/auth.js";
import bcrypt from "bcrypt";
import _ from "lodash";
import User from "../models/user.js";
import express from "express";
const router = express.Router();

//  @desc GET user profile
// @route  GET  /api/users/profile
//  @access  Private
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//  @desc GET user profile  FOR ADMIN PURPOSES
// @route  GET  /api/users/:id
// @access  Private/Admin
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.send(user);
});

//  @desc Update user profile
// @route  PUT  /api/users/profile
//  @access  Private
router.put("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }
  await user.save();
  res.send(user);
});

//  @desc Post user registeration
// @route  POST  /api/users
//  @access  Public
router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send(token);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get("/", auth, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) return res.status(400).send("Not authorized as an admin.");

  const users = await User.find({});
  res.json(users);
});

// @desc    Delete a user
// @route   delete /api/users/:id
// @access  Private/Admin
router.delete("/:id", auth, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) return res.status(400).send("Not authorized as an admin.");

  const user = await User.findById(req.params.id);
  if (user.isAdmin) return res.status(400).send("You can't delete an admin.");

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put("/:id", auth, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) return res.status(400).send("Not authorized as an admin.");

  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default router;
