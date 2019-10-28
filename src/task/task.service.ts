import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async getAllTask(): Promise<Task[]> {
    const allTask: Task[] = await this.taskModel.find();

    return allTask;
  }

  async getTaskWithFilter(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const tasks = await this.taskModel.find(filterDto);
    if (tasks.length === 0) {
      throw new NotFoundException('Nothing found');
    }
    return tasks;
  }

  getTaksbyId(id: string): Task {
    const found = this.tasks.find(task => task._id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
    };
    const newTask = await this.taskModel.create(task);
    return newTask;
  }

  updateTaskstatus(id: string, status: TaskStatus): Task {
    const task = this.getTaksbyId(id);
    task.status = status;
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete();
  }
}
