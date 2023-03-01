import mongoose from "mongoose";
const LadiesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 21,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      enum: ["Brown", "Chocolate", "DarkSkin", "Dark"],
      default: "Dark",
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Unavailable",
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const Ladies = mongoose.model("Ladies", LadiesSchema);
