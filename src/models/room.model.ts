import { Schema, model } from 'mongoose';
import { IRoom } from '../interface';

const RoomSchema = new Schema({
  name: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

export default model<IRoom>('Room', RoomSchema);