const bcrypt = require("bcryptjs");
const userModel = require("../model/userModel");
const nodemailer = require("nodemailer");
const sendEmail = require("./emailCtrl");
const jwt = require("jsonwebtoken");

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({
      username: req.body.username,
    });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist !!!", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Successfully", success: true,newUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User Not Found !!!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};



const forgotPassword = async (req, res) => {
  try {
    // Generate a random OTP
    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    }
    // Store OTPs temporarily (You might want to use a better storage mechanism)
    const otps = {};
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found with this email", success: false });
    }

    //  Generate OTP
    const otp = generateOTP();
    otps[email] = otp;

    // Send OTP via email
    const mailOptions = {
      to: email,
      subject: "One-Time Password (OTP) for Password Reset",
      text: `Your OTP for password reset is: ${otp}`,
    };

    sendEmail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully.", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred.", success: false });
  }
};

module.exports = {
  loginController,
  registerController,
  forgotPassword,
};
