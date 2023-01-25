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

export type InsertTaskCallback = (task: Partial<Task>) => void;

export type DeleteTaskCallback = (id: number) => void;

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;
}
