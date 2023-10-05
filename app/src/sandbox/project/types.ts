import { DropPosition } from '@epam/uui-core';

export interface Task {
    id: number;
    parentId?: number;
    name: string;
    estimate?: number;
    resources?: number[];
    startDate?: string;
    isDone?: boolean;
    complete?: number;
    description?: string;
    order?: string;
}

export interface Resource {
    id: number;
    name: string;
    fullName: string;
}

export type InsertTaskCallback = (position: DropPosition, relativeTask?: Task | null, existingTask?: Task | null) => void;
export type DeleteTaskCallback = (task: Task) => void;

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;
}
