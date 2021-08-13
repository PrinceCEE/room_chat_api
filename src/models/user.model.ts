import { Schema, model } from 'mongoose';
import { IUser } from '../interface';

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
});

export default model<IUser>('User', UserSchema);