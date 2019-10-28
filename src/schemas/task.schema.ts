import * as mongoose from 'mongoose';
import { TaskStatus } from '../task/task.model';

export const TaskSchema: any = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});
