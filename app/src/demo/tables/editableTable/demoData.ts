import { getOrderBetween } from '@epam/uui-core';
import { Task, Resource, Status } from './types';

const tasks: Partial<Task>[] = [
    { id: 1, name: 'Infrastructure', startDate: '2024-12-04', dueDate: '2024-12-06' }, { id: 101, name: 'Devops' }, { id: 10101, name: 'GIT Repository init' }, { id: 10102, name: 'CI - build code, publish artifacts' }, { id: 10103, name: 'Test instances - Dev, QA, UAT' }, { id: 10104, name: 'API connection & secrets management' }, { id: 10105, name: 'Production instance' }, { id: 102, name: 'Frontend' }, { id: 10201, name: 'Init CRA project' }, { id: 10202, name: 'Decide and document coding practices and processes' }, { id: 2, name: 'Shared services' }, { id: 201, name: 'Authentication' }, { id: 202, name: 'Integration with API' }, { id: 203, name: 'Routing' }, { id: 204, name: 'Localization' }, { id: 3, name: 'UUI Customization' }, { id: 301, name: 'Color palette' }, { id: 302, name: 'Core color tokens' }, { id: 303, name: 'Components tuning' }, { id: 304, name: 'Custom components modifiers' }, { id: 4, name: 'Shared Components' }, { id: 401, name: 'Accordion (foldable panel/section)' }, { id: 402, name: 'Alert' }, { id: 403, name: 'Attribute/Value section' }, { id: 404, name: 'Breadcrumbs' }, { id: 405, name: 'Dashboard Cards Elements' }, { id: 406, name: 'Forms headers/sub-headers' }, { id: 407, name: 'Icons' }, { id: 408, name: 'Masked input' }, { id: 409, name: 'Master-detail screen' }, { id: 410, name: 'Common Modal windows (e.g. confirmation)' }, { id: 411, name: 'Stepper' }, { id: 412, name: 'In-form Tables' }, { id: 413, name: 'User card' }, { id: 414, name: 'Top-level navigation' }, { id: 5, name: 'Pages Template Components' }, { id: 501, name: 'Page layout components' }, { id: 502, name: 'Master-detail' }, { id: 503, name: 'Full-screen table' }, { id: 504, name: 'Full-screen form' }, { id: 505, name: 'Dashboard' }, { id: 506, name: 'Catalog' }, { id: 6, name: 'Pages' }, { id: 601, name: 'Home' }, { id: 602, name: 'Catalog' }, { id: 603, name: 'Product Details' }, { id: 604, name: 'Favorites' }, { id: 605, name: 'Comparison' }, { id: 606, name: 'Check-out form' }, { id: 607, name: 'Admin area' }, { id: 60701, name: 'Products List' }, { id: 60702, name: 'Product Form' }, { id: 60703, name: 'Sales report' }, { id: 60704, name: 'Marketing dashboard' }, { id: 60705, name: 'Categories list editor' },
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
    { id: 1, name: 'FED', fullName: 'Front-end developer' }, { id: 2, name: 'BED', fullName: 'Back-end developer' }, { id: 3, name: 'QA', fullName: 'Quality assurance engineer' }, { id: 4, name: 'UXD', fullName: 'UX designer' }, { id: 5, name: 'BA', fullName: 'Business analyst' },
];

export const statuses: Status[] = [
    { id: 1, name: 'Planned', color: '#848484' },
    { id: 2, name: 'In Progress', color: '#009ECC' },
    { id: 3, name: 'Blocked', color: '#FCAA00' },
    { id: 4, name: 'At Risk', color: '#FA4B4B' },
    { id: 5, name: 'Complete', color: '#67A300' },
];
