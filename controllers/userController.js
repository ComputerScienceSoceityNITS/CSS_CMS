const User = require("../models/users");
const Crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

const signUp = async (req, res) => {
  try {
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
        codeforcesHandle: codeforcesHandle?.toLowerCase(),
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
      codeforcesHandle: codeforcesHandle || null,
      githubHandle: githubHandle || null,
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
  } catch (e) {
    console.log(e);
    res.status(401).json({
      status: "error",
      message: `something went wrong : ${e.name}`,
    });
  }
};

const login = async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      error: "Something Went Wrong. Please Try Again!!!",
    });
  }
};

const logout = async (req, res) => {
  try {

    res.clearCookie("css_jwt_token");
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (e) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    const email = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: email.email });

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Please Login!!!" });
  }
};

module.exports = { signUp, login, logout, authenticate, getUser };
