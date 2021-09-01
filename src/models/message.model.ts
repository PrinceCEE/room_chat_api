import { Schema, model } from "mongoose";
import { IMessage } from "../interface";

const MessageSchema = new Schema({
  content: String,
  sentFrom: { type: Schema.Types.ObjectId, ref: "User" },
  roomName: String,
});

export default model<IMessage>("Message", MessageSchema);
