import { Task, Status } from './types';

const tasks: Partial<Task>[] = [
    { id: 1, title: 'Infrastructure' }, { id: 2, title: 'Shared services' }, { id: 3, title: 'UUI Customization' }, { id: 4, title: 'Shared Components' }, { id: 5, title: 'Pages Template Components' }, { id: 6, title: 'Pages' }, { id: 7, title: 'Infrastructure' }, { id: 8, title: 'Shared services' }, { id: 9, title: 'UUI Customization' }, { id: 10, title: 'Shared Components' }, { id: 11, title: 'Pages Template Components' }, { id: 12, title: 'Pages' }, { id: 13, title: 'Infrastructure' }, { id: 14, title: 'Shared services' }, { id: 15, title: 'UUI Customization' }, { id: 16, title: 'Shared Components' }, { id: 17, title: 'Pages Template Components' }, { id: 18, title: 'Pages' }, { id: 19, title: 'Infrastructure' }, { id: 20, title: 'Shared services' }, { id: 21, title: 'UUI Customization' }, { id: 22, title: 'Shared Components' }, { id: 23, title: 'Pages Template Components' }, { id: 24, title: 'Pages' }, { id: 25, title: 'Pages' }, { id: 26, title: 'Infrastructure' }, { id: 27, title: 'Shared services' }, { id: 28, title: 'UUI Customization' }, { id: 29, title: 'Shared Components' }, { id: 30, title: 'Pages Template Components' }, { id: 111, title: 'Infrastructure' }, { id: 112, title: 'Shared services' }, { id: 113, title: 'UUI Customization' }, { id: 114, title: 'Shared Components' }, { id: 115, title: 'Pages Template Components' }, { id: 116, title: 'Pages' }, { id: 117, title: 'Infrastructure' }, { id: 118, title: 'Shared services' }, { id: 119, title: 'UUI Customization' }, { id: 1110, title: 'Shared Components' }, { id: 1111, title: 'Pages Template Components' }, { id: 1112, title: 'Pages' }, { id: 1113, title: 'Infrastructure' }, { id: 1114, title: 'Shared services' }, { id: 1115, title: 'UUI Customization' }, { id: 1116, title: 'Shared Components' }, { id: 1117, title: 'Pages Template Components' }, { id: 1118, title: 'Pages' }, { id: 1119, title: 'Infrastructure' }, { id: 1120, title: 'Shared services' }, { id: 1121, title: 'UUI Customization' }, { id: 1122, title: 'Shared Components' }, { id: 1123, title: 'Pages Template Components' }, { id: 1124, title: 'Pages' }, { id: 1125, title: 'Pages' }, { id: 1126, title: 'Infrastructure' }, { id: 1127, title: 'Shared services' }, { id: 1128, title: 'UUI Customization' }, { id: 1129, title: 'Shared Components' }, { id: 1130, title: 'Pages Template Components' },
];

export const getDemoTasks = () => {
    const byId: Record<number, Task> = {};

    tasks.forEach((t) => {
        byId[t.id] = t as Task;
    });

    return byId;
};

export const status: Status[] = [
    { id: 0, name: 'To do' }, { id: 1, name: 'In progress' }, { id: 2, name: 'Testing' }, { id: 3, name: 'Done' },
];
