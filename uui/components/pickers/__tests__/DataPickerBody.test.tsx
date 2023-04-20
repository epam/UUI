import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { ArrayDataSource } from '@epam/uui-core';
import { DataPickerBody, DataPickerBodyProps } from '../DataPickerBody';
import { DataPickerRow } from '../DataPickerRow';

const languageLevels = [
    { id: 2, level: 'A1' },
    { id: 3, level: 'A1+' },
    { id: 4, level: 'A2' },
    { id: 5, level: 'A2+' },
    { id: 6, level: 'B1' },
    { id: 7, level: 'B1+' },
    { id: 8, level: 'B2' },
    { id: 9, level: 'B2+' },
    { id: 10, level: 'C1' },
    { id: 11, level: 'C1+' },
    { id: 12, level: 'C2' },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

describe('DataPickerBody', () => {
    const rows = mockDataSource.getView({}, () => {}).getVisibleRows();
    const requiredProps: DataPickerBodyProps = {
        value: null,
        onValueChange: jest.fn(),
        rows: rows.map((props) => <DataPickerRow key={ props.id } renderItem={ (item: string) => <div>{item}</div> } id={ props.id } rowKey={ props.rowKey } index={ props.id } />),
        search: {
            value: null,
            onValueChange: jest.fn(),
        },
    };

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataPickerBody { ...requiredProps } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly without rows', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataPickerBody { ...requiredProps } rows={ [] } renderNotFound={ () => <div>Not found</div> } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DataPickerBody
                { ...requiredProps }
                editMode="modal"
                showSearch="auto"
                maxHeight={ 800 }
                searchSize="48"
                rows={ rows.map((props) => (
                    <DataPickerRow key={ props.id } renderItem={ (item: string) => <div>{item}</div> } id={ props.id } rowKey={ props.rowKey } index={ props.id } />
                )) }
                onKeyDown={ jest.fn }
                rowsCount={ 7 }
                totalCount={ 11 }
                scheduleUpdate={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
