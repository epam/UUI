import { Task, Status } from "./types";

const tasks: Partial<Task>[] = [
    { id: 1, title: "Infrastructure" },
    { id: 2, title: "Shared services" },
    { id: 3, title: "UUI Customization" },
    { id: 4, title: "Shared Components" },
    { id: 5, title: "Pages Template Components" },
    { id: 6, title: "Pages" },
    { id: 7, title: "Infrastructure" },
    { id: 8, title: "Shared services" },
    { id: 9, title: "UUI Customization" },
    { id: 10, title: "Shared Components" },
    { id: 11, title: "Pages Template Components" },
    { id: 12, title: "Pages" },
    { id: 13, title: "Infrastructure" },
    { id: 14, title: "Shared services" },
    { id: 15, title: "UUI Customization" },
    { id: 16, title: "Shared Components" },
    { id: 17, title: "Pages Template Components" },
    { id: 18, title: "Pages" },
    { id: 19, title: "Infrastructure" },
    { id: 20, title: "Shared services" },
    // { id: 21, title: "UUI Customization" },
    // { id: 22, title: "Shared Components" },
    // { id: 23, title: "Pages Template Components" },
    // { id: 24, title: "Pages" },
    // { id: 25, title: "Pages" },
    // { id: 26, title: "Infrastructure" },
    // { id: 27, title: "Shared services" },
    // { id: 28, title: "UUI Customization" },
    // { id: 29, title: "Shared Components" },
    // { id: 30, title: "Pages Template Components" },
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
