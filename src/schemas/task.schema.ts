import * as mongoose from 'mongoose';
import { TaskStatus } from '../task/task.model';

export const TaskSchema: any = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: TaskStatus, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
});
