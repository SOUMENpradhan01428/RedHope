const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Donor", "Hospital", "Admin"],
      default: "Donor",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },

    // Donor Only
    bloodGroup: {
      type: String,
      default: "",
    },
    
    // Gamification (Donor Only)
    totalPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },
    badges: [
      {
        name: String,
        description: String,
        points: Number,
        earnedAt: { type: Date, default: Date.now },
      }
    ],
    redeemedRewards: [
      {
        rewardId: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
        redeemedAt: { type: Date, default: Date.now },
      }
    ],

    // Hospital Only
    hospitalName: {
      type: String,
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    // Location (shared)
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    region: { type: String, enum: ["North", "South", "East", "West", ""], default: "" },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);