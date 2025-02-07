import { ArrayDataSource, AsyncDataSource } from '@epam/uui-core';
import { delay } from '@epam/uui-test-utils';

export type TestItemType = {
    id: number;
    level: string;
    name: string;
};

const smallDataSet: TestItemType[] = [
    { id: 2, level: 'A1', name: 'Elementary' },
    { id: 3, level: 'A1+', name: 'Elementary+' },
];

export const languageLevels: TestItemType[] = [
    { id: 2, level: 'A1', name: 'Elementary' },
    { id: 3, level: 'A1+', name: 'Elementary+' },
    { id: 4, level: 'A2', name: 'Pre-Intermediate' },
    { id: 5, level: 'A2+', name: 'Pre-Intermediate+' },
    { id: 6, level: 'B1', name: 'Intermediate' },
    { id: 7, level: 'B1+', name: 'Intermediate+' },
    { id: 8, level: 'B2', name: 'Upper-Intermediate' },
    { id: 9, level: 'B2+', name: 'Upper-Intermediate+' },
    { id: 10, level: 'C1', name: 'Advanced' },
    { id: 11, level: 'C1+', name: 'Advanced+' },
    { id: 12, level: 'C2', name: 'Proficiency' },
];

export type TestTreeItem = {
    id: number;
    name: string;
    parentId?: number;
};

const treeLikeData: TestTreeItem[] = [
    { id: 1, name: 'Parent 1' },
    { id: 1.1, parentId: 1, name: 'Child 1.1' },
    { id: 1.2, parentId: 1, name: 'Child 1.2' },
    { id: 1.3, parentId: 1, name: 'Child 1.3' },
    { id: 2, name: 'Parent 2' },
    { id: 2.1, parentId: 2, name: 'Child 2.1' },
    { id: 2.2, parentId: 2, name: 'Child 2.2' },
    { id: 2.3, parentId: 2, name: 'Child 2.3' },
    { id: 3, name: 'Parent 3' },
    { id: 3.1, parentId: 3, name: 'Child 3.1' },
    { id: 3.2, parentId: 3, name: 'Child 3.2' },
    { id: 3.3, parentId: 3, name: 'Child 3.3' },
];

export const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

export const mockEmptyDataSource = new ArrayDataSource({
    items: [],
});

export const mockSmallDataSource = new ArrayDataSource({
    items: smallDataSet,
});

export const mockSmallDataSourceAsync = new AsyncDataSource<TestItemType, number>({
    api: async () => {
        await delay(50);
        return smallDataSet;
    },
});

export const mockDataSourceAsync = new AsyncDataSource({
    api: jest.fn().mockImplementation(async () => {
        await delay(50);
        return languageLevels;
    }),
});

export const mockTreeLikeDataSourceAsync = new AsyncDataSource<TestTreeItem, number, any>({
    api: async () => {
        await delay(50);
        return treeLikeData;
    },
    getParentId: ({ parentId }) => parentId,
});
