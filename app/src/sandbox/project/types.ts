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
    __typename?: string;
}

export interface Resource {
    id: number;
    name: string;
}