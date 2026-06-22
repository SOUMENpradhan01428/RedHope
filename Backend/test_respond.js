require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const BloodRequest = require("./Models/BloodRequest");
const User = require("./Models/User");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const request = await BloodRequest.findOne({ status: "open" });
    const donor = await User.findOne({ role: "Donor" });
    
    console.log("Donor:", donor._id, donor.name);
    console.log("Request:", request._id);
    
    try {
      request.respondedBy.push({
        donorId: donor._id,
        name: donor.name,
        phone: donor.phone || "Not provided",
        bloodType: donor.bloodGroup || "Unknown",
      });
      await request.save();
      console.log("Saved successfully");
    } catch (e) {
      console.error("Save error:", e);
    }
    
    mongoose.disconnect();
  })
  .catch(console.error);
