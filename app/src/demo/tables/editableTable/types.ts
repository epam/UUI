import { DropPosition } from '@epam/uui-core';

export interface Task {
    id: number;
    parentId?: number;
    name: string;
    estimate?: number;
    resources?: number[];
    startDate?: string;
    dueDate?: string;
    status?: string;
    description?: string;
    order?: string;
    isDeleted?: boolean;
}

export interface Resource {
    id: number;
    name: string;
    fullName: string;
}

export interface Status {
    id: number;
    name: string;
    color?: string;
}

export type InsertTaskCallback = (position: DropPosition, relativeTask?: Task | null, existingTask?: Task | null) => void;
export type DeleteTaskCallback = (task: Task) => void;

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;
}
