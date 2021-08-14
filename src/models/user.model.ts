import { Schema, model } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { IUser } from '../interface';

const UserSchema = new Schema({
  username: String,
  email: String,
  password: {
    type: String,
    minLength: [6, "Password must be at least 6, but you provided {VALUE}"],
    required: [true, "You must provide a password"]
  },
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: "Room"
  }],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
});

UserSchema.pre<IUser>("save", async function(next) {
  if(!this.isModified("password")) {
    return next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.hashPassword = async function(pwd: string) {
  const salt = await genSalt(10);
  (this as IUser).password = await hash(pwd, salt);
  return this;
};

export default model<IUser>('User', UserSchema);