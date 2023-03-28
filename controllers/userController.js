const User = require("../models/users");
const Crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { catchAsync, AppError } = require("../utils/errorHandler");

const getUser = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.name,
    });
  }
};

const generateHash = (password, salt = null) => {
  if (salt == null) {
    const salt = Crypto.randomBytes(16).toString("hex");
    const hash = Crypto.scryptSync(password, salt, 64).toString("hex") + "$" + salt;
    return hash;
  } else {
    const hash = Crypto.scryptSync(password, salt, 64).toString("hex");
    return hash;
  }
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, password, email, scholarID, codeforcesHandle, githubHandle } = req.body;

  if (!name || !email || !password || !scholarID) {
    return res.status(401).json({
      status: "fail",
      message: "please fill in all the details",
    });
  }

  const query = User.findOne();
  query.or([
    { email: email.toLowerCase() },
    { scholarID: scholarID },
    {
      codeforcesHandle: codeforcesHandle?.toLowerCase() || "nonexistentcfhandle",
    },
  ]);
  const existingUser = await query;

  if (existingUser) {
    return res.status(401).json({
      status: "fail",
      message: "user with same email / scholarID / codeforces handle already exists",
    });
  }

  const encrypted_password = generateHash(password);

  const user = await User({
    name,
    email,
    password: encrypted_password,
    scholarID,
    codeforcesHandle: codeforcesHandle,
    githubHandle: githubHandle,
  }).save();

  res.status(201).json({
    status: "success",
    user: {
      name: user.name,
      email: user.email,
      scholarID: user.scholarID,
      githubHandle: user.githubHandle,
      codeforcesHandle: user.codeforcesHandle,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ error: "Please Fill in All the Details!!!" });
    return;
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401).json({ error: "No Such User!!!" });
    return;
  }

  const hashedPassword = user.password;
  const [hash, salt] = hashedPassword.split("$");

  const givenPassword = req.body.password;
  const givenHash = generateHash(givenPassword, salt);

  if (givenHash == hash) {
    const token = jwt.sign(
      {
        email: email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const options = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    };

    res.status(200).cookie("css_jwt_token", token, options).json({
      success: true,
      user,
      token,
      secure: false,
    });
  } else {
    res.status(401).json({
      status: "fail",
      error: "Invalid Credentials",
    });
  }
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("css_jwt_token");
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

const authenticate = catchAsync(async (req, res, next) => {
  if (!req.headers.cookie) {
    return next(new AppError("No cookie found...try logging in again."));
  }
  const token = req.headers.cookie.split("=")[1];
  const email = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ email: email.email });

  req.user = user;
  next();
});

module.exports = { signUp, login, logout, authenticate, getUser };
