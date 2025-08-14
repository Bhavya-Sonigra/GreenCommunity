import { Schema, model } from "mongoose";

const FootprintLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    activity: { type: String, required: true },
    activityType: {
      type: String,
      enum: ["transport", "energy", "food", "waste", "other"],
      default: "other",
      index: true,
    },
    category: { type: String },
    tags: [{ type: String, index: true }],
    emission: { type: Number, required: true }, // in kg CO2e
    calculation: {
      method: { type: String },
      source: { type: String },
      factors: { type: Schema.Types.Mixed },
    },
    location: {
      country: { type: String },
      city: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    metadata: { type: Schema.Types.Mixed },
    notes: { type: String },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    community: { type: Schema.Types.ObjectId, ref: "Community" },
  },
  {
    timestamps: true,
  }
);

FootprintLogSchema.index({ user: 1, activityType: 1, date: -1 });

export default model("FootprintLog", FootprintLogSchema);
