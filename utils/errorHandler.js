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

  console.log(`${error.name}: ${error.message}`);

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = { AppError, catchAsync, globalErrorHandler };
