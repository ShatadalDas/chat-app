import mongoose, { model, Schema } from "mongoose";

const messagesSchema = new Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    msg: String,
    time: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Message", messagesSchema);
