import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("User", userSchema);
