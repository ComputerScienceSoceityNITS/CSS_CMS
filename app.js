const express = require("express");
const fileUpload = require("express-fileupload");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const app = express();
const { globalErrorHandler, AppError } = require("./utils/errorHandler");

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/.env" });
}

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true }));
app.use((req, res, next) => {
  console.log(`[${req.method}] : ${req.originalUrl}`);
  next();
});
app.use((req, res, next) => {
  console.log(`[${req.method}] : ${req.originalUrl}`);
  next();
});

// enable cors
const whitelist = ["http://127.0.0.1:3000", "http://localhost:3000", process.env.CLIENT_URL, process.env.ADMIN_URL];

app.use(
  cors({
    origin: whitelist,
    method: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Origin", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
  })
);

app.options("*", (req, res, next) => {
  return res.status(200).json({});
});

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

const members = require("./routes/membersRoute.js");
const admin = require("./routes/adminRoute.js");

app.use("/api/admin", members);
app.use("/api/admin", admin);

//routes for general users
const userRoute = require("./routes/userRoutes.js");
const abacusRoute = require("./routes/abacusRoute.js");
const enigmaRoute = require("./routes/enigmaRoute");

app.use("/api/admin/user", userRoute);
app.use("/api/admin/abacus", abacusRoute);
app.use("/api/admin/enigma", enigmaRoute);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `endpoint [${req.method}] : ${req.originalUrl} not found on this server`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
