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
    isDeleted?: boolean;
}

export interface Resource {
    id: number;
    name: string;
    fullName: string;
}

export interface InsertTaskCallback {
    (task: Partial<Task>): void;
}

export interface DeleteTaskCallback {
    (id: number): void;
}

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;
}
