import { Resource, Status } from './types';

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
