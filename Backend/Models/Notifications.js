const mongoose = require("mongoose");
const { Schema } = mongoose;
const NotificationSchema = new Schema({
  user: {
    //may be admin or student or donor
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String, // here type will tell  notification to admin user ot student to tell which is the person
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Notifications = mongoose.model("notifications", NotificationSchema);
module.exports = Notifications;
