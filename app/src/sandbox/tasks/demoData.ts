import { Task, Status } from "./types";

const tasks: Partial<Task>[] = [
    { id: 1, title: "Infrastructure" },
    { id: 2, title: "Shared services" },
    { id: 3, title: "UUI Customization" },
    { id: 4, title: "Shared Components" },
    { id: 5, title: "Pages Template Components" },
    { id: 6, title: "Pages" },
];

export const getDemoTasks = () => {
    const byId: Record<number, Task> = {};

    tasks.forEach((t) => {
        byId[t.id] = t as Task;
    });

    return byId;
};

export const status: Status[] = [
    { id: 0, name: 'To do' },
    { id: 1, name: 'In progress' },
    { id: 2, name: 'Testing' },
    { id: 3, name: 'Done'},
];
