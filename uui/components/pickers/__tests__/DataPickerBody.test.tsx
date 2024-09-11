import React from 'react';
import { renderHook, renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ArrayDataSource } from '@epam/uui-core';
import { DataPickerBody, DataPickerBodyProps } from '../DataPickerBody';
import { DataPickerRow } from '../DataPickerRow';

const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

describe('DataPickerBody', () => {
    const hookResult = renderHook(
        () => mockDataSource.useView({}, () => {}, {}),
    );
    const view = hookResult.result.current;
    const rows = view.getVisibleRows();
    const requiredProps: DataPickerBodyProps = {
        value: {},
        onValueChange: jest.fn(),
        rows: rows.map(
            (props) => <DataPickerRow key={ props.id } size="36" renderItem={ (item: string) => <div>{item}</div> } id={ props.id } rowKey={ props.rowKey } index={ props.id } value="" />,
        ),
        search: {
            value: '',
            onValueChange: jest.fn(),
        },
    };

    it('should be rendered with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataPickerBody { ...requiredProps } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered without rows', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataPickerBody { ...requiredProps } rows={ [] } renderNotFound={ () => <div>Not found</div> } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DataPickerBody
                { ...requiredProps }
                editMode="modal"
                showSearch="auto"
                maxHeight={ 800 }
                searchSize="48"
                rows={ rows.map((props) => (
                    <DataPickerRow
                        key={ props.id }
                        size="36"
                        renderItem={ (item: string) => <div>{item}</div> }
                        id={ props.id }
                        rowKey={ props.rowKey }
                        index={ props.id }
                        value={ props.value?.level }
                    />
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
