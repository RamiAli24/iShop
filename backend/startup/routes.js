import express from "express";
import users from "../routes/users.js";
import auth from "../routes/auth.js";
import Product from "../routes/products.js";
import Order from "../routes/order.js";
import Upload from "../routes/upload.js";

export default function (app) {
  app.use(express.json()); // so we can parse req.body
  app.use("/api/products", Product);
  app.use("/api/users", users);
  app.use("/api/login", auth);
  app.use("/api/orders", Order);
  app.use("/api/upload", Upload);
}
