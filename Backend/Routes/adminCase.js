const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const fetchStudent = require("../Middleware/fetchStudent");
const fetchAdmin = require("../Middleware/fetchAdmin");
const Request = require("../Models/Request");
const Admin = require("../Models/Admin");
const ApprovedCase = require("../Models/ApprovedCase");
const Notifications = require("../Models/Notifications");
const Student = require("../Models/Student");
const Donor = require("../Models/Donor");
const WorksOn = require("../Models/WorksOn");

//route to approve case by admin
router.post(
  "/admin/case-approve-by-admin/:id",
  fetchStudent,
  [
    body("startDate", "Enterrhe start date of the case"),
    body("endDate", "Enter the end date of the case"),
    body("payment_timeline", "Enter the payment timeline"),
    body("total_payments", "Enter the total payments"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response = errors.array();
      console.log(response[0].msg);
      return res.status(400).json(response[0].msg);
    }
    const req_admin = await Admin.findById(req.user.id);
    const { startDate, endDate, payment_timeline, total_payments } = req.body;
    try {
      let approved_case = await ApprovedCase.create({
        admin: req.user.id,
        request: req.params.id,
        startDate: startDate,
        endDate: endDate,
        payment_timeline: payment_timeline,
        total_payments: total_payments,
        payments_completed: 0,
      });
    
      await Request.findByIdAndUpdate(req.params.id, {
        status: "approved",
      });

      //sending notification to student and admin
      let request_by_student = await Request.findById(req.params.id);
      await Notifications.create({
        user: req.user.id,
        type: "admin",
        message:
          "Case has been approved successfully with description " +
          request_by_student.description,
      });
      await Notifications.create({
        user: request_by_student.student,
        type: "student",
        message:
          "Your Case has been approved successfully with description " +
          request_by_student.description,
      });
      res.json("Case been approved successfully");
    } catch (error) {
      console.log(error)
      res.json("Error sending request");
    }
  }
);
// route to get all the case requested by students to approve
router.get("/admin/get-all-requested-cases", fetchAdmin, async (req, res) => {
  try {
    let requests = await Request.find({ status: "pending" });
    res.json(requests);
  } catch (error) {
    console.log(error);
    res.json("Error fetching requests");
  }
});

//route to all cases approved by admin
router.get("/admin/get-all-approved-cases", fetchAdmin, async (req, res) => {
  try {
    let approved_cases = await ApprovedCase.find();
    res.json(approved_cases);
    1;
  } catch (error) {
    res.json("Error fetching approved cases");
  }
});

// route to get all cases completed by donors
router.get("/admin/get-all-completed-cases", fetchAdmin, async (req, res) => {
  try {
    let completed_cases = await ApprovedCase.find({
      payments_completed: { $eq: "$total_payments" },
    });
    res.json(completed_cases);
  } catch (error) {
    res.json("Error fetching completed cases");
  }
});

// route to get all cases in progress
router.get("/admin/get-all-current-cases", fetchAdmin, async (req, res) => {
  const currentDate = new Date();
  try {
    let current_cases = await ApprovedCase.find({
      endDate: { $gt: currentDate },
    });
    res.json(current_cases);
  } catch (error) {
    res.json("Error fetching current cases");
  }
});

// route to get all past cases
router.get("/admin/get-all-past-cases", fetchAdmin, async (req, res) => {
  const currentDate = new Date();
  try {
    let past_cases = await ApprovedCase.find({
      endDate: { $lt: currentDate },
    });
    res.json(past_cases);
  } catch (error) {
    res.json("Error fetching past cases");
  }
});

// route to get all students
router.get("/admin/get-all-students", fetchAdmin, async (req, res) => {
  try {
    let students = await Student.find();
    res.json(students);
  } catch (error) {
    res.json("Error fetching students");
  }
});

// route to get all donors
router.get("/admin/get-all-donors", fetchAdmin, async (req, res) => {
  try {
    let donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.json("Error fetching donors");
  }
});

// route to view details of requested case by student
router.get(
  "/admin/requested-case-details/:id",
  fetchAdmin,
  async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
      if (!request) {
        return res.json("No case found");
      }
      return res.json(request);
    } catch (error) {
      res.json("Error viewing case");
    }
  }
);

// route to view student profile by clicking on requested case
router.get(
  "/admin/requested-case-student-profile/:id",
  fetchAdmin,
  async (req, res) => {
    try {
      const request = await Request.findById(req.params.id).populate("student");
      if (!request) {
        return res.json("No student profile found");
      }
      return res.json(request.student);
    } catch (error) {
      res.json("Error viewing student profile");
    }
  }
);

// route to view donor profile by clicking on approved case
router.get("/admin/approved-case-donor-profile", fetchAdmin, async (req, res) => {
  try {
    const approvedCase = await WorksOn.findById(req.params.id);
    const donor = await Donor.find({donor: approvedCase.donor});
    const request = await Request.find
  } catch (error) {
    res.json("Error viewing donor profile");
  }
});

// route to view student profile by clicking on approved case
router.get("/admin/approved-case-student-profile/:id", fetchAdmin, async (req, res) => {
  try {
    const approvedCase = await ApprovedCase.findById(req.params.id);
    if (!approvedCase) {
      return res.json("No approved case found");
    }
    const request = await Request.find({request: approvedCase.request});
    if (!request) {
      return res.json("No student profile found");
    }
    const student= await Student.findOne({student:request.student});
    if (!student) {
      return res.json("No student profile found");
    }
    return res.json(student);  
  } catch (error) {
    res.json("Error viewing student profile");
  }
});

module.exports = router;
