import { getOrderBetween } from "@epam/uui-core";
import { Task, Resource } from "./types";

const tasks: Partial<Task>[] = [
    { id: 1, name: "Infrastructure" },
    { id: 2, name: "Shared services" },
    { id: 3, name: "UUI Customization" },
    { id: 4, name: "Shared Components" },
    { id: 5, name: "Pages Template Components" },
    { id: 6, name: "Pages" },
];

export const getDemoTasks = () =>  tasks.reduce((acc, task) => ({ ...acc, [task.id]: task }), {});

export const resources: Resource[] = [
    { id: 1, name: "FED", fullName: "Front-end developer" },
    { id: 2, name: "BED", fullName: "Back-end developer" },
    { id: 3, name: "QA", fullName: "Quality assurance engineer" },
    { id: 4, name: "UXD", fullName: "UX designer" },
    { id: 5, name: "BA", fullName: "Business analyst" },
];
