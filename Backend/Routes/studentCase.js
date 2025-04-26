const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const fetchStudent = require("../Middleware/fetchStudent");
const multer = require("multer");
const Request = require("../Models/Request");
const Student = require("../Models/Student");
const Notifications = require("../Models/Notifications");
const ApprovedCase = require("../Models/ApprovedCase");

//multer to upload images
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "backend/public/images/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

//route for student to apply for request
router.post(
  "/student/request_by_student",
  fetchStudent,
  // [body("description", "Enter descriptionm of your case")],
  // upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response = errors.array();
      console.log(response[0].msg);
      return res.status(400).json(response[0].msg);
    }
    try {
      // const imageName = req.file.filename;
      const { title, description } = req.body;
      let request_by_student = await Request.create({
        student: req.user.id,
        status: "pending",
        // photo: imageName,
        title: title,
        description: description,
      });
      console.log(request_by_student);
      if (!request_by_student) {
        return res.json("Error sending request");
      }
      await Notifications.create({
        user: req.user.id,
        type: "student",
        message: "Case Request has been sent successfully",
      });
      res.json("Case Request has been sent successfully");
    } catch (error) {
      res.json("Error sending request");
    }
  }
);

// get all request of student
router.get(
  "/student/get_all_requests_by_student",
  fetchStudent,
  async (req, res) => {
    try {
      const requests = await Request.find({ student: req.user.id });
      res.json(requests);
    } catch (error) {
      console.log(error);
      return res.json("Error fetching requests");
    }
  }
);

// get all current approved cases of student
router.get("/student/approved-cases", fetchStudent, async (req, res) => {
  const currentDate = new Date();
  try {
    const approved_cases = await ApprovedCase.find({
      student: req.user.id,
      endDate: { $gt: currentDate },
    }).populate("request");
    if (!approved_cases) {
      return res.json("No approved cases found");
    }
    res.json(approved_cases);
  } catch (error) {
    res.json("Error fetching approved cases");
  }
});

// route to get complted approbved cses by student
router.get("/student/completed-cases", fetchStudent, async (req, res) => {
  const currentDate = new Date();
  try {
    const approved_cases = await ApprovedCase.find({
      student: req.user.id,
      endDate: { $lt: currentDate },
    }).populate("request");
    if (!approved_cases) {
      return res.json("No approved cases found");
    }
    res.json(approved_cases);
  } catch (error) {
    res.json("Error fetching approved cases");
  }
});

// route to get all notifications of student
router.get("/student/notifications", fetchStudent, async (req, res) => {
  try {
    const notifications = await Notifications.find({ user: req.user.id });
    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.json("Error fetching notifications");
  }
});

router.get("/student/view-application/:id", fetchStudent, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.json("No application found");
    }
    res.json(request);
  } catch (error) {
    console.log(error);
    res.json("Error fetching application");
  }
});

router.get("/student/view-case/:id", async (req, res) => {
  try {
    let approvedCase = await ApprovedCase.findById(req.params.id).populate(
      "request"
    );
    res.json(approvedCase);
  } catch (error) {
    console.log(error);
    return res.json("Error fetching requests");
  }
});
module.exports = router;
