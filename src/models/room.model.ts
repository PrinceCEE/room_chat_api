import { Schema, model } from 'mongoose';
import { IRoom } from '../interface';

const RoomSchema = new Schema({
  name: {
    type: String,
    required: [true, "You must provide the name of the room"]
  },
  creatorUsername: {
    type: String,
    required: [true, "Username of the creator missing"]
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

export default model<IRoom>('Room', RoomSchema);