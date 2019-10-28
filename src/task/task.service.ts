import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class TaskService {
  private logger = new Logger('Task');
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) { }

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

  async getTaksbyId(id: string, userId: string): Promise<Task> {
    const found = await this.taskModel.findOne({ _id: id, user: userId });
    if (!found) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      user: userId,
    };
    const newTask = await this.taskModel.create(task);
    return newTask;
  }

  async updateTaskstatus(id: string, status: TaskStatus, userId: string): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate({ _id: id, user: userId }, { status });
    this.logger.debug(task);
    if (!task) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete();
  }
}
