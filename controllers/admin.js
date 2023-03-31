const Admin = require("../models/admin"); //schema
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/errorHandler");

// No need to call this function, offical admin is already created
exports.addAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.create(req.body);
  res.status(201).json({
    success: true,
    admin,
  });
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  const { CSS_Website } = req.cookies;

  if (!CSS_Website) {
    return res.status(401).json({
      status: "fail",
      message: "Please login to access this Resource",
    });
  }

  const decodedData = jwt.verify(CSS_Website, process.env.JWT_SECRET);
  const user = await Admin.findById(decodedData.id);
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "admin not found",
    });
  }
  req.user = user;
  next();
});

//login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //checkng if user has entered both email and password
  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "Please Enter Email and Password",
    });
  }

  const admin = await Admin.findOne({ role: "admin" }).select("+password");
  if (admin.email !== email || admin.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid Enter Email or Password",
    });
  }
  sendToken(admin, 201, res);
});

//logout user
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("CSS_Website", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

const sendToken = (user, ststusCode, res) => {
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  console.log(token);

  res.status(ststusCode).cookie("CSS_Website", token, options).json({
    success: true,
    user,
    token,
  });
};
