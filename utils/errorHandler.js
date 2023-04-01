class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  };
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = `${error.statusCode}`.startsWith("4") ? "fail" : "error";

  console.log({ error });

  // duplicate field error
  if (error.code === 11000) {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error.message = `Duplicate field value: ${value}. Please use another value!`;
  }

  // field validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((el) => el.message);
    error.message = `Invalid input data. ${errors.join(". ")}`;
  }

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = { AppError, catchAsync, globalErrorHandler };
