export interface Task {
    id: number;
    parentId?: number;
    name: string;
    estimate?: number;
    resource?: string;
    startDate?: string;
    isDone?: boolean;
    complete?: number;
    description?: string;
    order?: string;
    isPlaceholder?: boolean;
}

export interface Resource {
    id: number;
    name: string;
}

export interface InsertTaskCallback {
    (task: Partial<Task>): void;
}

export interface DeleteTaskCallback {
    (id: number): void;
}

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;;
}