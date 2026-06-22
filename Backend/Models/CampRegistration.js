const mongoose = require("mongoose");

const campRegistrationSchema = new mongoose.Schema(
  {
    camp: { type: mongoose.Schema.Types.ObjectId, ref: "Camp", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    healthDetails: {
      isThalassemic: { type: Boolean, default: false },
      hasHepatitis: { type: Boolean, default: false },
      hasHighBloodPressure: { type: Boolean, default: false },
      hasDiabetes: { type: Boolean, default: false },
      hasSTD: { type: Boolean, default: false },
      isSmoker: { type: Boolean, default: false },
    },
    status: { 
      type: String, 
      enum: ["registered", "pending_completion", "completed", "rejected"], 
      default: "registered" 
    },
    certificateUrl: { type: String },
    visitTiming: { type: String },
    feedback: { type: String },
    attended: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampRegistration", campRegistrationSchema);
