import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) { }

    @Get()
    getAllTask(@Query() filterDto: GetTaskFilterDto): Task[] {
        if (Object.keys(filterDto).length) { return this.taskService.getTaskWithFilter(filterDto); }
        return this.taskService.getAllTask();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaksbyId(id);
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto): Task {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskstatus(
        @Param('id') id: string,
        @Body('status') status: TaskStatus,
    ): Task {
        return this.taskService.updateTaskstatus(id, status);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.taskService.deleteTask(id);
    }

}
