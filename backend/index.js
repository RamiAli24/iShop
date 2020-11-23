import morgan from "morgan";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./startup/db.js";
import { errorHandler, notFound } from "./middleware/error.js";
import routes from "./startup/routes.js";

dotenv.config(); //must be before mongoDB connection, because it has enviroment variables
connectDB();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

routes(app);
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

//we have to make the uploads folder static, so it becomes accessible in the browser
// __dirname points to the current root directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
