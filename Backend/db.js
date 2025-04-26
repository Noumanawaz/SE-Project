const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env"});
const mongoURI = process.env.mongoURI // Corrected to match the environment variable name

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = connectToMongo;
