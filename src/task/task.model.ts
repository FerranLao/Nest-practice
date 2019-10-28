export interface Task {
    _id?: string;
    title: string;
    description: string;
    status: TaskStatus;
    user: any;
}

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}
