import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});