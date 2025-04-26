const mongoose = require("mongoose");
const { Schema } = mongoose;
const DonorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
});

const Donor = mongoose.model("donors", DonorSchema);
module.exports = Donor;
