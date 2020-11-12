// thats only for handling errors inside the request pipeline ((express))
import winston from "winston";
import "express-async-errors"; //for handling promise rejections

const notFound = function (req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = function (err, req, res, next) {
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  // if (res.statusCode === 404)
  //   return res.status(404).send(`Not Found - ${req.originalUrl}`);
  // res.status(500).json({
  //   message: err.message,
  //   stack: process.env.NODE_ENV === "production" ? null : err.stack,
  // });

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.send({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    status: statusCode,
  });
};

export { notFound, errorHandler };
