export interface Task extends TaskTimeReport {
    id: number;
    parentId?: number;
    name: string;
}

export type DayKey = `${number}-${number}-${number}`;

type TaskTimeReport = {
    [day: DayKey]: number;
};

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
