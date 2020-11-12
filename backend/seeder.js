import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/user.js";
import Product from "./models/product.js";
import Order from "./models/order.js";
import connectDB from "./startup/db.js";

dotenv.config();
// dotenv must be always before the mongoDB connection because of enviroment variable that stores the connection URI
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log("Data imported!");
    process.exit();
    //so it shuts terminal after execution
  } catch (error) {
    console.log("Error is: ", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.log("Error is: ", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

// argv[2] means third index in the CLI ==>  node backend/seeder -d
