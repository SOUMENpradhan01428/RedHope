const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hospitalName: {
      type: String,
      required: true,
    },

    bloodType: {
      type: String,
      required: true,
    },

    units: {
      type: Number,
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    location: {
      address: {
        type: String,
        default: "",
      },
      lat: {
        type: Number,
        required: true,
        default: 0,
      },
      lng: {
        type: Number,
        required: true,
        default: 0,
      }
    },

    urgency: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "fulfilled", "cancelled"],
      default: "open",
    },

    respondedBy: [
      {
        donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        phone: String,
        bloodType: String,
        respondedAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);