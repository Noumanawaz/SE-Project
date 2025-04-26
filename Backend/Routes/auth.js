const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../Models/Student");
const Donor = require("../Models/Donor");
const Admin = require("../Models/Admin");
const fetchStudent = require("../Middleware/fetchStudent");
const fetchDonor = require("../Middleware/fetchDonor");
const fetchAdmin = require("../Middleware/fetchAdmin");
require("dotenv").config({ path: "./.env" });

const JWT_SECRET = process.env.JWT_SECRET;
router.post(
  "/create-student",
  [
    check("first_name", "Please enter a valid name").not().isEmpty(),
    check("last_name", "Please enter a valid name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
    check("phone_no", "Please enter a valid phone number").isLength({
      min: 11,
    }),
    check("cnic", "Please enter a valid CNIC").isLength({ min: 13 }),
    check("institution", "Please enter a valid institution").not().isEmpty(),
    check("class_level", "Please enter a valid class").not().isEmpty(),
  ],
  async (req, res) => {
    let success = false;
    let hashPassword;
    const errors = validationResult(req);
    let {
      first_name,
      last_name,
      email,
      password,
      phone_no,
      cnic,
      institution,
      class_level,
    } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let student = await Student.findOne({ email });
      if (student) {
        return res
          .status(400)
          .json({ error: "Student with this email already exists" });
      }
      student = await Student.findOne({ phone_no });
      if (student) {
        return res
          .status(400)
          .json({ error: "Student with this phone number already exists" });
      }
      student = await Student.findOne({ cnic });
      if (student) {
        return res
          .status(400)
          .json({ error: "Student with this CNIC already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
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
      const data = {
        user: {
          id: student.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occured");
    }
  }
);

router.post(
  "/login-student",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
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
          id: student.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occured");
    }
  }
);

router.put(
  "/student/update-profile",
  fetchStudent,
  [
    check("first_name", "Please enter a valid name").not().isEmpty(),
    check("last_name", "Please enter a valid name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("phone_no", "Please enter a valid phone number").isLength({
      min: 11,
    }),
    check("cnic", "Please enter a valid CNIC").isLength({ min: 13 }),
    check("institution", "Please enter a valid institution").not().isEmpty(),
    check("class_level", "Please enter a valid class").not().isEmpty(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        first_name,
        last_name,
        email,
        phone_no,
        cnic,
        institution,
        class_level,
      } = req.body;

      // Find the user by ID
      let user = await Student.findById(req.user.id);

      // Update user fields
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.phone_no = phone_no;
      user.cnic = cnic;
      user.institution = institution;
      user.class_level = class_level;

      // Save the updated user
      await user.save();

      success = true;
      res.json("Your profile has been updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occurred");
    }
  }
);

//student profile get
router.get("/student/get-profile", fetchStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.json("Student not found");
    }
    res.json(student);
  } catch (error) {
    console.log(error);
    return res.json("Error getting student profile");
  }
});

router.post(
  "/create-donor",
  [
    check("first_name", "Please enter a name").not().isEmpty(),
    check("last_name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
    check("phone_no", "Please enter a valid phone number").isLength({
      min: 11,
    }),
    check("cnic", "Please enter a valid CNIC").isLength({ min: 13 }),
    check("profession", "Please enter a profession").not().isEmpty(),
  ],
  async (req, res) => {
    let success = false;
    let hashPassword;
    const errors = validationResult(req);
    let { first_name, last_name, email, password, phone_no, cnic, profession } =
      req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let donor = await Donor.findOne({ email });
      if (donor) {
        return res
          .status(400)
          .json({ error: "Donor with this email already exists" });
      }
      donor = await Donor.findOne({ phone_no });
      if (donor) {
        return res
          .status(400)
          .json({ error: "Donor with this phone number already exists" });
      }
      donor = await Donor.findOne({ cnic });
      if (donor) {
        return res
          .status(400)
          .json({ error: "Donor with this CNIC already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
      donor = await Donor.create({
        first_name,
        last_name,
        email,
        password: hashPassword,
        phone_no,
        cnic,
        profession,
      });
      const data = {
        user: {
          id: donor.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occured");
    }
  }
);

router.post(
  "/login-donor",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let donor = await Donor.findOne({ email });
      if (!donor) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, donor.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const data = {
        user: {
          id: donor.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occured");
    }
  }
);
//donor profile get
router.get("/donor/get-profile", fetchDonor, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id).select("-password");
    if (!donor) {
      return res.json("Donor not found");
    }
    res.json(donor);
  } catch (error) {
    console.log(error);
    return res.json("Error getting student profile");
  }
});

//edit donor
router.put(
  "/donor/update-profile",
  fetchDonor,
  [
    check("first_name", "Please enter a name").not().isEmpty(),
    check("last_name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("phone_no", "Please enter a valid phone number").isLength({
      min: 11,
    }),
    check("cnic", "Please enter a valid CNIC").isLength({ min: 13 }),
    check("profession", "Please enter a profession").not().isEmpty(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { first_name, last_name, email, phone_no, cnic, profession } =
        req.body;

      // Find the user by ID
      let donor = await Donor.findById(req.user.id);

      // Update user fields
      donor.first_name = first_name;
      donor.last_name = last_name;
      donor.email = email;

      donor.phone_no = phone_no;
      donor.cnic = cnic;
      donor.profession = profession;

      // Save the updated user
      await donor.save();

      success = true;
      res.json("Your profile has been updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occurred");
    }
  }
);

router.post(
  "/create-admin",
  [
    check("first_name", "Please enter a name").not().isEmpty(),
    check("last_name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
    check("admin_role", "Please enter an admin role").not().isEmpty(),
  ],
  async (req, res) => {
    let success = false;
    let hashPassword;
    let full_name;
    const errors = validationResult(req);
    let { first_name, last_name, email, password, admin_role } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res
          .status(400)
          .json({ error: "Admin with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
      full_name = first_name + " " + last_name;
      admin = await Admin.create({
        full_name: full_name,
        email,
        password: hashPassword,
        admin_role,
      });
      const data = {
        user: {
          id: admin.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occured");
    }
  }
);

router.post(
  "/login-admin",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
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
      const data = {
        user: {
          id: admin.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occured");
    }
  }
);

router.get('/admin/get-profile', fetchAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.json('Admin not found');
    }
    res.json(admin);
  } catch (error) {
    console.log(error);
    return res.json('Error getting admin profile');
  }
});

module.exports = router;