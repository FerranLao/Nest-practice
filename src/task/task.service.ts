import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TaskService {
    private tasks: Task[] = [];

    getAllTask(): Task[] {
        return this.tasks;
    }

    getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTask();
        if (status) {
            tasks = tasks.filter(task => task.status === status)
        }
        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
        }
        return tasks;
    }

    getTaksbyId(id: string): Task {
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
            throw new NotFoundException(`Task with ID:${id} not found`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }

    updateTaskstatus(id: string, status: TaskStatus): Task {
        const task = this.getTaksbyId(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaksbyId(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }
}
