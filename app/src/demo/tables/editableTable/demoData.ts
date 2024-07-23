import { getOrderBetween } from '@epam/uui-core';
import { Task, Resource, Status } from './types';

const tasks: Partial<Task>[] = [
    { id: 1, name: 'Infrastructure', type: 'story', startDate: '2024-11-01', order: 'm', estimate: 53, status: '2', dueDate: '2024-12-12' },
    { id: 2, name: 'Shared services', type: 'story', order: 'yym', estimate: 20, startDate: '2024-12-12', status: '2', dueDate: '2025-01-01' },
    { id: 3, name: 'UUI Customization', type: 'story', order: 'yyym', estimate: 20, startDate: '2024-11-08', status: '2', dueDate: '2024-11-28' },
    { id: 4, name: 'Shared Components', type: 'story', order: 'yyyym', estimate: 84, startDate: '2024-11-28', status: '2', dueDate: '2025-02-20' },
    { id: 5, name: 'Pages Template Components', type: 'story', order: 'yyyyyyym', estimate: 36, startDate: '2025-02-20', status: '2', dueDate: '2025-03-28' },
    { id: 6, name: 'Pages', type: 'story', order: 'yyyyyyyyv', estimate: 66, startDate: '2025-03-28', status: '2', dueDate: '2025-06-02' },
    { id: 101, name: 'Devops', type: 'story', order: 's', parentId: 1, estimate: 46, startDate: '2024-11-01', status: '2', dueDate: '2024-12-12' },
    { id: 102, name: 'Frontend', type: 'story', order: 'yv', parentId: 1, estimate: 7, startDate: '2024-11-01', status: '2', dueDate: '2024-11-08' },
    { id: 201, name: 'Authentication', estimate: 5, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'yys', parentId: 2, exactStartDate: '2024-12-12' },
    { id: 202, name: 'Integration with API', estimate: 5, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'yyv', parentId: 2, exactStartDate: '2024-12-17' },
    { id: 203, name: 'Routing', estimate: 5, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'yyx', parentId: 2, exactStartDate: '2024-12-22' },
    { id: 204, name: 'Localization', estimate: 5, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'yyy', parentId: 2, exactStartDate: '2024-12-27' },
    { id: 301, name: 'Color palette', estimate: 2, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyys', parentId: 3, exactStartDate: '2024-11-08' },
    { id: 302, name: 'Core color tokens', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyv', parentId: 3, exactStartDate: '2024-11-10' },
    { id: 303, name: 'Components tuning', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyx', parentId: 3, exactStartDate: '2024-11-16' },
    { id: 304, name: 'Custom components modifiers', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyy', parentId: 3, exactStartDate: '2024-11-22' },
    { id: 401, name: 'Accordion (foldable panel/section)', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyys', parentId: 4, exactStartDate: '2024-11-28' },
    { id: 402, name: 'Alert', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyv', parentId: 4, exactStartDate: '2024-12-04' },
    { id: 403, name: 'Attribute/Value section', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyx', parentId: 4, exactStartDate: '2024-12-10' },
    { id: 404, name: 'Breadcrumbs', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyy', parentId: 4, exactStartDate: '2024-12-16' },
    { id: 405, name: 'Dashboard Cards Elements', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyym', parentId: 4, exactStartDate: '2024-12-22' },
    { id: 406, name: 'Forms headers/sub-headers', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyys', parentId: 4, exactStartDate: '2024-12-28' },
    { id: 407, name: 'Icons', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyv', parentId: 4, exactStartDate: '2025-01-03' },
    { id: 408, name: 'Masked input', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyx', parentId: 4, exactStartDate: '2025-01-09' },
    { id: 409, name: 'Master-detail screen', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyy', parentId: 4, exactStartDate: '2025-01-15' },
    { id: 410, name: 'Common Modal windows (e.g. confirmation)', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyym', parentId: 4, exactStartDate: '2025-01-21' },
    { id: 411, name: 'Stepper', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyys', parentId: 4, exactStartDate: '2025-01-27' },
    { id: 412, name: 'In-form Tables', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyv', parentId: 4, exactStartDate: '2025-02-02' },
    { id: 413, name: 'User card', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyx', parentId: 4, exactStartDate: '2025-02-08' },
    { id: 414, name: 'Top-level navigation', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyy', parentId: 4, exactStartDate: '2025-02-14' },
    { id: 501, name: 'Page layout components', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyys', parentId: 5, exactStartDate: '2025-02-20' },
    { id: 502, name: 'Master-detail', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyv', parentId: 5, exactStartDate: '2025-02-26' },
    { id: 503, name: 'Full-screen table', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyx', parentId: 5, exactStartDate: '2025-03-04' },
    { id: 504, name: 'Full-screen form', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyy', parentId: 5, exactStartDate: '2025-03-10' },
    { id: 505, name: 'Dashboard', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyym', parentId: 5, exactStartDate: '2025-03-16' },
    { id: 506, name: 'Catalog', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyys', parentId: 5, exactStartDate: '2025-03-22' },
    { id: 601, name: 'Home', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyx', parentId: 6, exactStartDate: '2025-03-28' },
    { id: 602, name: 'Catalog', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyy', parentId: 6, exactStartDate: '2025-04-03' },
    { id: 603, name: 'Product Details', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyym', parentId: 6, exactStartDate: '2025-04-09' },
    { id: 604, name: 'Favorites', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyys', parentId: 6, exactStartDate: '2025-04-15' },
    { id: 605, name: 'Comparison', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyv', parentId: 6, exactStartDate: '2025-04-21' },
    { id: 606, name: 'Check-out form', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyx', parentId: 6, exactStartDate: '2025-04-27' },
    { id: 607, name: 'Admin area', type: 'story', order: 'yyyyyyyyyy', parentId: 6, estimate: 30, status: '2', startDate: '2025-05-03', dueDate: '2025-06-02' },
    { id: 10101, name: 'GIT Repository init', estimate: 1, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'v', parentId: 101, exactStartDate: '2024-11-01' },
    { id: 10102, name: 'CI - build code, publish artifacts', estimate: 6, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'x', parentId: 101, exactStartDate: '2024-11-02' },
    { id: 10103, name: 'Test instances - Dev, QA, UAT', estimate: 5, startDate: '2024-11-01', assignee: 3, status: '2', type: 'task', order: 'y', parentId: 101, exactStartDate: '2024-11-01' },
    { id: 10104, name: 'API connection & secrets management', estimate: 30, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'ym', parentId: 101, exactStartDate: '2024-11-08' },
    { id: 10105, name: 'Production instance', estimate: 4, startDate: '2024-11-01', assignee: 2, status: '2', type: 'task', order: 'ys', parentId: 101, exactStartDate: '2024-12-08' },
    { id: 10201, name: 'Init CRA project', estimate: 2, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yx', parentId: 102, exactStartDate: '2024-11-01' },
    { id: 10202, name: 'Decide and document coding practices and processes', estimate: 5, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yy', parentId: 102, exactStartDate: '2024-11-03' },
    { id: 60701, name: 'Products List', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyym', parentId: 607, exactStartDate: '2025-05-03' },
    { id: 60702, name: 'Product Form', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyys', parentId: 607, exactStartDate: '2025-05-09' },
    { id: 60703, name: 'Sales report', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyyv', parentId: 607, exactStartDate: '2025-05-15' },
    { id: 60704, name: 'Marketing dashboard', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyyx', parentId: 607, exactStartDate: '2025-05-21' },
    { id: 60705, name: 'Categories list editor', estimate: 6, startDate: '2024-11-01', assignee: 1, status: '2', type: 'task', order: 'yyyyyyyyyyy', parentId: 607, exactStartDate: '2025-05-27' },
];

export const getDemoTasks = () => {
    const byId: Record<number, Task> = {};

    tasks.forEach((t, index) => {
        const prevTask = tasks[index - 1]; t.order = getOrderBetween(prevTask?.order, null); byId[t.id] = t as Task;
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
    { id: '1', name: 'Planned', priority: 1, color: '#848484' },
    { id: '2', name: 'In Progress', priority: 2, color: '#009ECC' },
    { id: '3', name: 'Blocked', priority: 3, color: '#FCAA00' },
    { id: '4', name: 'At Risk', priority: 4, color: '#FA4B4B' },
    { id: '5', name: 'Complete', priority: 5, color: '#67A300' },
];

export const statusTags = statuses.reduce<Record<string, string>>(
    (acc, status) => ({ ...acc, [status.id]: status.name.replace(/ /ig, '') }),
    {},
);
