import mongoose, { model, Schema } from "mongoose";

const contactSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    contacts: {
      type: [
        {
          name: String,
          contactUser: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            unique: true,
          },
          lastMsg: { type: mongoose.SchemaTypes.ObjectId, ref: "Message" },
        },
      ],
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Contact", contactSchema);
