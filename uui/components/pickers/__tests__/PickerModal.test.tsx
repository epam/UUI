import React from 'react';
import { ArrayDataSource } from '@epam/uui-core';
import { renderSnapshotWithContextAsync } from "@epam/test-utils";
import { PickerModal } from '../PickerModal';

const languageLevels = [
    { "id": 2, "level": "A1" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 5, "level": "A2+" },
    { "id": 6, "level": "B1" },
    { "id": 7, "level": "B1+" },
    { "id": 8, "level": "B2" },
    { "id": 9, "level": "B2+" },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

describe('PickerModal', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockDataSource }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode="single"
                initialValue={ null }
                isActive
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockDataSource }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode="multi"
                initialValue={ [] }
                isActive
                getName={ item => item.level }
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

