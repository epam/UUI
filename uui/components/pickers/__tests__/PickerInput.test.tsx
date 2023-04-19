import React, { ReactNode } from 'react';
import { ArrayDataSource } from '@epam/uui-core';
import { renderSnapshotWithContextAsync } from "@epam/test-utils";
import { PickerInput } from '../PickerInput';

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

describe('PickerInput', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerInput
                value={ null }
                onValueChange={ jest.fn }
                selectionMode="single"
                dataSource={ mockDataSource }
                disableClear
                searchPosition="input"
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerInput
                value={ [2, 3] }
                onValueChange={ jest.fn }
                selectionMode="multi"
                dataSource={ mockDataSource }
                size="48"
                maxItems={ 20 }
                editMode="modal"
                valueType={ 'id' }
                getName={ item => item.level }
                autoFocus
                placeholder="Test placeholder"
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
                searchPosition="body"
                minBodyWidth={ 900 }
                renderNotFound={ ({ search, onClose = jest.fn }) => <div
                    onClick={ onClose }>{ `No found ${ search }` }</div> }
                renderFooter={ props => <div>{ props as unknown as ReactNode }</div> }
                cascadeSelection
                dropdownHeight={ 48 }
                minCharsToSearch={ 4 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

