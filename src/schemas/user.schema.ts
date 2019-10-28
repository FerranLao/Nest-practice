import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userName: String,
  age: String,
  password: String,
});
