const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../Models/Student");
const Donor = require("../Models/Donor");
const Admin = require("../Models/Admin");
router.use(require('cookie-parser')());
require("dotenv").config({ path: "./.env" });

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'strict' };

// Student Routes
router.post("/create-student", [
  check("first_name", "Please enter a valid name").not().isEmpty(),
  check("last_name", "Please enter a valid name").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").not().isEmpty(),
  check("phone_no", "Please enter a valid phone number").not().isEmpty(),
  check("cnic", "Please enter a valid CNIC").not().isEmpty(),
  check("institution", "Please enter a valid institution").not().isEmpty(),
  check("class_level", "Please enter a valid class").not().isEmpty(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, email, password, phone_no, cnic, institution, class_level } = req.body;
  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ error: "Student with this email already exists" });
    }
    student = await Student.findOne({ phone_no });
    if (student) {
      return res.status(400).json({ error: "Student with this phone number already exists" });
    }
    student = await Student.findOne({ cnic });
    if (student) {
      return res.status(400).json({ error: "Student with this CNIC already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    student = await Student.create({
      first_name,
      last_name,
      email,
      password: hashPassword,
      phone_no,
      cnic,
      institution,
      class_level,
    });
    const data = { user: { id: student.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.cookie('token', authToken, COOKIE_OPTIONS).json({ authToken });
  } catch (error) {
    res.status(500).send("Some error occurred");
  }
});
router.post("/login-student", [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const data = {
      user: {
        id: student.id, email: student.email, first_name: student.first_name, last_name: student.last_name, phone_no: student.phone_no, cnic: student.cnic, institution: student.institution, class_level: student.class_level,
        hasFilledApplication: student.hasFilledApplication || false,
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);

    res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ response: data, authToken, success: true });
  } catch (error) {
    res.status(500).send("Some error occurred");
  }
});






// Donor Routes
router.post("/create-donor", [
  check("first_name", "Please enter a name").not().isEmpty(),
  check("last_name", "Please enter a name").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").not().isEmpty(),
  check("phone_no", "Please enter a valid phone number").not().isEmpty(),
  check("cnic", "Please enter a valid CNIC").not().isEmpty(),
  check("profession", "Please enter a profession").not().isEmpty(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, email, password, phone_no, cnic, profession } = req.body;
  try {
    let donor = await Donor.findOne({ email });
    if (donor) {
      return res.status(400).json({ error: "Donor with this email already exists" });
    }
    donor = await Donor.findOne({ phone_no });
    if (donor) {
      return res.status(400).json({ error: "Donor with this phone number already exists" });
    }
    donor = await Donor.findOne({ cnic });
    if (donor) {
      return res.status(400).json({ error: "Donor with this CNIC already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    donor = await Donor.create({
      first_name,
      last_name,
      email,
      password: hashPassword,
      phone_no,
      cnic,
      profession,
    });
    const data = { user: { id: donor.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.cookie('token', authToken, COOKIE_OPTIONS).json({ authToken });
  } catch (error) {
    res.status(500).send("Some error occurred");
  }
});

router.post("/login", [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body; // Extract email, password, and role

  try {
    let user = await Donor.findOne({ email }) || await Student.findOne({ email }) || await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate Role
    const roleMap = {
      student: Student,
      donor: Donor,
      admin: Admin
    };

    if (!(user instanceof roleMap[role])) {
      return res.status(400).json({ error: "Role does not match" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const userData = { id: user.id, email: user.email, role };
    const authToken = jwt.sign(userData, JWT_SECRET);

    res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ success: true, authToken });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).send("Some error occurred");
  }
});


// Admin Routes
router.post("/create-admin", [
  check("first_name", "Please enter a name").not().isEmpty(),
  check("last_name", "Please enter a name").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({ min: 6 }),
  check("admin_role", "Please enter an admin role").not().isEmpty(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, email, password, admin_role } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const full_name = `${first_name} ${last_name}`;
    admin = await Admin.create({
      full_name,
      email,
      password: hashPassword,
      admin_role,
    });
    const data = { user: { id: admin.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.cookie('token', authToken, COOKIE_OPTIONS).json({ authToken });
  } catch (error) {
    res.status(500).send("Some error occurred");
  }
});

router.post("/login-admin", [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({ min: 6 }),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const data = { user: { id: admin.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    console.log(success)
    res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ response: data, authToken, success: true });

  } catch (error) {
    res.status(500).send("Some error occurred");
  }
});


// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
