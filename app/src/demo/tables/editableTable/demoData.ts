import { getOrderBetween } from '@epam/uui-core';
import { Task, Resource, Status } from './types';

const tasks: Partial<Task>[] = [
    { id: 1, name: 'Infrastructure', type: 'story', startDate: '2024-11-01' },
    { id: 101, name: 'Devops', type: 'story' },
    { id: 10101, name: 'GIT Repository init', estimate: 1, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 10102, name: 'CI - build code, publish artifacts', estimate: 6, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 10103, name: 'Test instances - Dev, QA, UAT', estimate: 5, startDate: '2024-11-01', assignee: 3, status: 2 as unknown as string, type: 'task' },
    { id: 10104, name: 'API connection & secrets management', estimate: 30, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 10105, name: 'Production instance', estimate: 4, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 102, name: 'Frontend', type: 'story' },
    { id: 10201, name: 'Init CRA project', estimate: 1, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 10202, name: 'Decide and document coding practices and processes', estimate: 5, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 2, name: 'Shared services', type: 'story' },
    { id: 201, name: 'Authentication', estimate: 5, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 202, name: 'Integration with API', estimate: 5, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 203, name: 'Routing', estimate: 5, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 204, name: 'Localization', estimate: 5, startDate: '2024-11-01', assignee: 2, status: 2 as unknown as string, type: 'task' },
    { id: 3, name: 'UUI Customization', type: 'story' },
    { id: 301, name: 'Color palette', estimate: 2, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 302, name: 'Core color tokens', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 303, name: 'Components tuning', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 304, name: 'Custom components modifiers', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 4, name: 'Shared Components', type: 'story' },
    { id: 401, name: 'Accordion (foldable panel/section)', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 402, name: 'Alert', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 403, name: 'Attribute/Value section', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 404, name: 'Breadcrumbs', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 405, name: 'Dashboard Cards Elements', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 406, name: 'Forms headers/sub-headers', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 407, name: 'Icons', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 408, name: 'Masked input', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 409, name: 'Master-detail screen', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 410, name: 'Common Modal windows (e.g. confirmation)', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 411, name: 'Stepper', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 412, name: 'In-form Tables', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 413, name: 'User card', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 414, name: 'Top-level navigation', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 5, name: 'Pages Template Components', type: 'story' },
    { id: 501, name: 'Page layout components', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 502, name: 'Master-detail', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 503, name: 'Full-screen table', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 504, name: 'Full-screen form', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 505, name: 'Dashboard', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 506, name: 'Catalog', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 6, name: 'Pages', type: 'story' },
    { id: 601, name: 'Home', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 602, name: 'Catalog', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 603, name: 'Product Details', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 604, name: 'Favorites', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 605, name: 'Comparison', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 606, name: 'Check-out form', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 607, name: 'Admin area', type: 'story' },
    { id: 60701, name: 'Products List', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 60702, name: 'Product Form', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 60703, name: 'Sales report', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 60704, name: 'Marketing dashboard', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
    { id: 60705, name: 'Categories list editor', estimate: 6, startDate: '2024-11-01', assignee: 1, status: 2 as unknown as string, type: 'task' },
];

export const getDemoTasks = () => {
    const byId: Record<number, Task> = {};

    tasks.forEach((t, index) => {
        const prevTask = tasks[index - 1];
        t.order = getOrderBetween(prevTask?.order, null);
        byId[t.id] = t as Task;
    });

    tasks.forEach((t) => {
        const idStr = '0' + t.id + '';
        if (idStr.length > 2) {
            t.parentId = +idStr.slice(0, idStr.length - 2);
            if (!byId[t.parentId]) {
                throw new Error(`Can't find task with parent id=${t.parentId} for task id=${t.id}`);
            }
        }
    });

    return byId;
};

export const resources: Resource[] = [
    { id: 1, name: 'FED', fullName: 'Front-end developer' },
    { id: 2, name: 'BED', fullName: 'Back-end developer' },
    { id: 3, name: 'QA', fullName: 'Quality assurance engineer' },
    { id: 4, name: 'UXD', fullName: 'UX designer' },
    { id: 5, name: 'BA', fullName: 'Business analyst' },
];

export const statuses: Status[] = [
    { id: 1, name: 'Planned', color: '#848484' },
    { id: 2, name: 'In Progress', color: '#009ECC' },
    { id: 3, name: 'Blocked', color: '#FCAA00' },
    { id: 4, name: 'At Risk', color: '#FA4B4B' },
    { id: 5, name: 'Complete', color: '#67A300' },
];
