import { DataQueryFilter, DataTableSelectedCellData } from '@epam/uui-core';

export type StatusType = 'To do' | 'In progress' | 'Testing' | 'Done';
export interface Status {
    id: number;
    name: StatusType;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    estimate: number;
    complete: number;
    status: Status;
    startDate?: string;
    endDate?: string;
}

export type InsertTaskCallback = (task: Partial<Task>) => void;

export type DeleteTaskCallback = (id: number) => void;

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;
}

export type SelectedCellData = DataTableSelectedCellData<Task, number, DataQueryFilter<Task>>;
