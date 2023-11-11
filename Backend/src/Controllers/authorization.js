const { default: mongoose } = require("mongoose");
const administratorModel = require("../Models/Adminstrator.js");
const DoctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 6 * 60;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const emailService = "youstina2307@outlook.com"; // e.g., 'gmail'
const emailUser = "youstina2307@outlook.com";
const emailPassword = "23july2002";

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

const createToken = (id) => {
  return jwt.sign({ id }, "secret-unkown", {
    expiresIn: maxAge,
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const doctor1 = await DoctorModel.findOne({ username });
    const patient1 = await patientModel
      .findOne({ username })
      .populate("packagesPatient");
    console.log(patient1);
    const admin1 = await administratorModel.findOne({ username });

    if (doctor1) {
      const auth = bcrypt.compare(password, doctor1.password);
      if (auth) {
        const token = createToken(doctor1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Doctor", user: doctor1 });
      }
      throw Error("incorrect password");
    }

    if (patient1) {
      const auth = bcrypt.compare(password, patient1.password);
      if (auth) {
        const token = createToken(patient1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Patient", user: patient1 });
      }
      throw Error("incorrect password");
    }

    if (admin1) {
      const auth = bcrypt.compare(password, admin1.password);
      if (auth) {
        const token = createToken(admin1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Admin", user: admin1 });
      }
      throw Error("incorrect password");
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret-unkown", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        // Store the user information in the request object
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
};

const updateUserInfoInCookie = (req, res, user) => {
  const token = createToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
};

let otpNum;

const otp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  otpNum = randomstring.generate({
    length: 6, // Adjust the OTP length as needed
    charset: "numeric",
  });

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otpNum}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log("OTP sent: " + info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    }
  });
};

// POST API endpoint to verify the OTP
const verifyOtp = async (req, res) => {
  console.log(otpNum);
  const { inputNumber } = req.body;

  if (!inputNumber) {
    return res.status(400).json({ error: "Input number is required" });
  }

  if (otpNum === inputNumber) {
    res.status(200).json({ message: "OTP is valid." });
  } else {
    res.status(400).json({ error: "OTP is invalid." });
  }
};

module.exports = {
  login,
  requireAuth,
  logout,
  updateUserInfoInCookie,
  otp,
  verifyOtp,
};
