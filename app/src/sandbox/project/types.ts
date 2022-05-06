export interface Task {
    id: number;
    parentId?: number;
    name: string;
    estimate?: number;
}