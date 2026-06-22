const mongoose = require("mongoose");

const bloodStockSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    currentUnits: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumUnits: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a hospital can only have one stock entry per blood type
bloodStockSchema.index({ hospital: 1, bloodType: 1 }, { unique: true });

module.exports = mongoose.model("BloodStock", bloodStockSchema);
