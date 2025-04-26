const mongoose = require("mongoose");
const { Schema } = mongoose;
const ApprovedCaseSchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "requests",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  payment_timeline: {
    type: String, // here payment timeline will tell when the payment will be done
    required: true, // e.g "1 month , 1 year 6 month etc"
  },
  postedDate: {
    type: Date,
    default: Date.now,
    
  },
  total_payments: {
    type: Number,
    required: true,
  },
  payments_completed: {
    type: Number,
    required: true,
  },
});

const ApprovedCase = mongoose.model("approved_case", ApprovedCaseSchema);
module.exports = ApprovedCase;
