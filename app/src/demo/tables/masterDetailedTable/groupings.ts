import { ArrayDataSource } from '@epam/uui-core';
import { Grouping } from './types';

export const groupings: Grouping[] = [
    { id: 'jobTitle', name: 'Job Title' },
    { id: 'department', name: 'Department' },
    { id: 'location', name: 'Location' },
];

export const groupingsDataSource = new ArrayDataSource({
    items: groupings,
});
