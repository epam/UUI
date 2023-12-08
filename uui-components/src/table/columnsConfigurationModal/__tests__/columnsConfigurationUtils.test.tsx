import { ColumnsConfigurationRowProps, GroupedDataColumnProps } from '../types';
import { ColumnsConfig, DataColumnProps } from '@epam/uui-core';
import { groupAndFilterSortedColumns, isColumnFilteredOut, sortColumnsAndAddGroupKey } from '../columnsConfigurationUtils';

function getTestDataSet1() {
    const A: DataColumnProps = {
        key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10,
    };
    const B: DataColumnProps = {
        key: '6', caption: 'b', isAlwaysVisible: true, width: 10,
    };
    const C: DataColumnProps = {
        key: '2', fix: 'right', caption: 'c', isAlwaysVisible: false, width: 10,
    };
    const D: DataColumnProps = {
        key: '5', caption: 'd', isAlwaysVisible: false, width: 10,
    };
    const E: DataColumnProps = {
        key: '4', caption: 'e', isAlwaysVisible: false, width: 10,
    };
    const F: DataColumnProps = {
        key: '3', caption: 'f', isAlwaysVisible: false, width: 10,
    };
    const prevConfig: ColumnsConfig = {
        [D.key]: { width: 10, isVisible: false, order: 'd' },
        [E.key]: { width: 10, isVisible: false, order: 'e' },
        [F.key]: { width: 10, isVisible: true, order: 'f' },
        [A.key]: {
            fix: 'left', width: 10, isVisible: true, order: 'a',
        },
        [B.key]: { width: 10, isVisible: true, order: 'b' },
        [C.key]: {
            width: 10, fix: 'right', isVisible: true, order: 'c',
        },
    };
    return {
        prevConfig, A, B, C, D, E, F,
    };
}

const unpinnedFields : ColumnsConfigurationRowProps[] = [
    {
        groupKey: 'displayedUnpinned',
        key: 'Column 1',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 1',
    },
    {
        groupKey: 'displayedUnpinned',
        key: 'Column 2',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 2',
    },
    {
        groupKey: 'displayedUnpinned',
        key: 'Column 3',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 3',
    },
];

const pinnedFields : ColumnsConfigurationRowProps[] = [
    {
        groupKey: 'displayedPinned',
        key: 'Column 4',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 4',
    },
    {
        groupKey: 'displayedPinned',
        key: 'Column 5',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 5',
    },
];

const pinnedRightFields:ColumnsConfigurationRowProps[] = [
    {
        groupKey: 'displayedPinnedRight',
        key: 'Column 6',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        fix: 'right',
        width: 0,
        caption: 'Column 6',
    },
    {
        groupKey: 'displayedPinnedRight',
        key: 'Column 7',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        fix: 'right',
        width: 0,
        caption: 'Column 7',
    },
];

const hiddenFields: ColumnsConfigurationRowProps[] = [
    {
        groupKey: 'hidden',
        key: 'Column 8',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 8',
    },
    {
        groupKey: 'hidden',
        key: 'Column 9',
        toggleVisibility: jest.fn(),
        togglePin: jest.fn(),
        onCanAcceptDrop: jest.fn(),
        onDrop: jest.fn(),
        columnConfig: {},
        isDndAllowed: true,
        isPinned: false,
        isPinnedAlways: false,
        width: 0,
        caption: 'Column 9',
    },
];

describe('columnsConfigurationUtils', () => {
    describe('sortColumnsAndAddGroupKey', () => {
        it('should sort columns by "order" and should add "groupKey" attribute', () => {
            const {
                prevConfig, A, B, C, D, E, F,
            } = getTestDataSet1();
            const columns = [
                F, A, E, B, D, C,
            ];
            const result = sortColumnsAndAddGroupKey({ columns, prevConfig });
            const expected: GroupedDataColumnProps[] = [
                { ...A, groupKey: 'displayedPinned' }, { ...B, groupKey: 'displayedUnpinned' }, { ...C, groupKey: 'displayedPinnedRight' }, { ...D, groupKey: 'hidden' }, { ...E, groupKey: 'hidden' }, { ...F, groupKey: 'displayedUnpinned' },
            ];
            expect(result).toEqual(expected);
        });
    });

    describe('isColumnFilteredOut', () => {
        it('should filter out columns without caption', () => {
            const A: DataColumnProps = {
                key: '1', fix: 'left', caption: '', isAlwaysVisible: false, width: 10,
            };
            const result = isColumnFilteredOut(A, undefined);
            expect(result).toBe(true);
        });
        it('should not filter out columns which match filter criteria (ignore case)', () => {
            const A: DataColumnProps = {
                key: '1', fix: 'left', caption: 'name', isAlwaysVisible: false, width: 10,
            };
            const result = isColumnFilteredOut(A, ['NAME']);
            expect(result).toBe(false);
        });
        // it('should not filter out columns with React node as caption', () => {
        //     const A: DataColumnProps = {
        //         key: '1', fix: 'left', caption: <div />, isAlwaysVisible: false, width: 10,
        //     };
        //     const result = isColumnFilteredOut(A, 'NAME');
        //     expect(result).toBe(true);
        // });
    });

    describe('groupAndFilterSortedColumns', () => {
        it('should group and filter sorted columns correctly', () => {
            const sortedColumns: ColumnsConfigurationRowProps[] = [
                ...unpinnedFields,
                ...pinnedFields,
                ...hiddenFields,
                ...pinnedRightFields,
            ];
            const getSearchFields = jest.fn().mockReturnValue([]);
            const searchValue = '';

            const prevConfig = {
                ...sortedColumns.reduce((acc, column) => ({ ...acc, [column.key]: { isVisible: true, width: 10, order: column.key } }), {}),
            };
            sortColumnsAndAddGroupKey({ columns: sortedColumns, prevConfig });
            const result = groupAndFilterSortedColumns({ sortedColumns, searchValue, getSearchFields });

            expect(JSON.stringify(result)).toEqual(JSON.stringify({
                displayedPinned: [
                    ...pinnedFields,
                ],
                displayedUnpinned: [
                    ...unpinnedFields,
                ],
                hidden: [
                    ...hiddenFields,
                ],
                displayedPinnedRight: [
                    ...pinnedRightFields,
                ],
            }));
        });
    });
});
