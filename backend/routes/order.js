import express from "express";
const router = express.Router();
import Order from "../models/order.js";
import auth from "../middleware/auth.js";

// @desc    Get All orders
// @route   GET /api/orders/
// @access  Private/Admin
router.get("/", auth, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) return res.status(400).send("Not authorized as an admin.");

  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get("/myorders", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc Create new order
// @route  POST /api/orders
// access Private
router.post("/", auth, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc Get order by id
// @route  GET /api/orders/:id
// access Private
router.get("/:id", auth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.send(order);
  } else {
    res.status(404);
    throw new Error("Order not found!");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
router.put("/:id/pay", auth, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
router.put("/:id/deliver", auth, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) return res.status(400).send("Not authorized as an admin.");

  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export default router;
