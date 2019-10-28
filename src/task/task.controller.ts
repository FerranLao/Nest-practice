import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.model';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Get()
  async getAllTask(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
  ): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTaskWithFilter(filterDto);
    }
    return await this.taskService.getAllTask();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return await this.taskService.getTaksbyId(id, user._id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    const newTask: Task = await this.taskService.createTask(createTaskDto, user._id);
    return newTask;
  }

  @Patch('/:id/status')
  async updateTaskstatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.updateTaskstatus(id, status, user._id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }
}
