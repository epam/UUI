import {
    moveColumnRelativeToAnotherColumn, toggleAllColumnsVisibility, toggleSingleColumnPin, toggleSingleColumnVisibility,
} from '../columnsConfigurationActions';
import { ColumnsConfig, DataColumnProps, IColumnConfig } from '@epam/uui-core';
import { GroupedDataColumnProps } from '../types';

function getTestDataSet1() {
    const A: GroupedDataColumnProps = {
        key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10, groupKey: 'displayedPinnedLeft',
    };
    const B: GroupedDataColumnProps = {
        key: '2', caption: 'b', isAlwaysVisible: true, width: 10, groupKey: 'displayedUnpinned',
    };
    const C: GroupedDataColumnProps = {
        key: '3', caption: 'c', isAlwaysVisible: false, width: 10, groupKey: 'hidden',
    };
    const D: GroupedDataColumnProps = {
        key: '4', fix: 'right', caption: 'd', isAlwaysVisible: true, width: 10, groupKey: 'displayedPinnedLeft',
    };
    const columnsSorted: GroupedDataColumnProps[] = [
        A, B, C, D,
    ];
    const prevConfig: ColumnsConfig = {
        [A.key]: {
            fix: 'left', width: 10, isVisible: true, order: 'a',
        } as IColumnConfig,
        [B.key]: { width: 10, isVisible: true, order: 'b' } as IColumnConfig,
        [C.key]: { width: 10, isVisible: false, order: 'c' } as IColumnConfig,
        [D.key]: { fix: 'right', width: 10, isVisible: true, order: 'd' } as IColumnConfig,
    };
    return {
        prevConfig, columnsSorted, A, B, C,
    };
}

function getTestDataSet2() {
    const A: DataColumnProps = {
        key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10,
    };
    const B: DataColumnProps = {
        key: '2', caption: 'b', isAlwaysVisible: true, width: 10,
    };
    const C: DataColumnProps = {
        key: '3', caption: 'c', isAlwaysVisible: false, width: 10,
    };
    const D: DataColumnProps = {
        key: '4', fix: 'right', caption: '', width: 10,
    };
    const columnsSorted: DataColumnProps[] = [
        A, B, C, D,
    ];
    const prevConfig: ColumnsConfig = {
        [A.key]: {
            fix: 'left', width: 10, isVisible: true, order: 'a',
        } as IColumnConfig,
        [B.key]: { width: 10, isVisible: true, order: 'b' } as IColumnConfig,
        [C.key]: { width: 10, isVisible: false, order: 'c' } as IColumnConfig,
        [D.key]: { width: 10, isVisible: true, order: 'd' } as IColumnConfig,
    };
    return { prevConfig, columnsSorted };
}

describe('columnsConfigurationActions', () => {
    describe('toggleSingleColumnVisibility', () => {
        it('should hide visible column', () => {
            const { prevConfig, columnsSorted, A } = getTestDataSet1();
            const result = toggleSingleColumnVisibility({ columnKey: A.key, prevConfig, columnsSorted });
            const expected = {
                1: { isVisible: false, order: 'bm', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
                4: { fix: 'right', isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });
        it('should show hidden column', () => {
            const { prevConfig, columnsSorted, C } = getTestDataSet1();
            const result = toggleSingleColumnVisibility({ columnKey: C.key, prevConfig, columnsSorted });
            const expected = {
                1: {
                    fix: 'left', isVisible: true, order: 'a', width: 10,
                },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: true, order: 'bm', width: 10 },
                4: { fix: 'right', isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('toggleSingleColumnPin', () => {
        it('should pin-left a visible column', () => {
            const { prevConfig, columnsSorted, B } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: B.key, prevConfig, columnsSorted, fix: 'left' });
            const expected = {
                1: {
                    fix: 'left', isVisible: true, order: 'a', width: 10,
                },
                2: {
                    fix: 'left', isVisible: true, order: 'am', width: 10,
                },
                3: { isVisible: false, order: 'c', width: 10 },
                4: { fix: 'right', isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });

        it('should pin-right a visible column', () => {
            const { prevConfig, columnsSorted, B } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: B.key, prevConfig, columnsSorted, fix: 'right' });
            const expected = {
                1: {
                    fix: 'left', isVisible: true, order: 'a', width: 10,
                },
                2: {
                    fix: 'right', isVisible: true, order: 'bm', width: 10,
                },
                3: { isVisible: false, order: 'c', width: 10 },
                4: { fix: 'right', isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });

        it('should unpin a visible column', () => {
            const { prevConfig, columnsSorted, A } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: A.key, prevConfig, columnsSorted, fix: undefined });
            const expected = {
                1: { isVisible: true, order: 'am', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
                4: { fix: 'right', isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });

        it('should pin-left a hidden column and automatically make it visible', () => {
            const { prevConfig, columnsSorted, C } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: C.key, prevConfig, columnsSorted, fix: 'left' });
            const expected = {
                1: { fix: 'left', isVisible: true, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { fix: 'left', isVisible: true, order: 'am', width: 10 },
                4: { fix: 'right', isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('moveColumnRelativeToAnotherColumn', () => {
        it('should be able to move a column right under another column', () => {
            const {
                prevConfig, A, C, B,
            } = getTestDataSet1();
            const columnConfig = prevConfig[A.key];
            const targetColumn = prevConfig[C.key];
            const targetNextColumn: IColumnConfig = null;
            const targetPrevColumn = prevConfig[B.key];
            const result = moveColumnRelativeToAnotherColumn({
                columnConfig, targetColumn, targetNextColumn, targetPrevColumn, position: 'bottom',
            });
            const expected = { isVisible: false, order: 'n', width: 10 };
            expect(result).toEqual(expected);
        });
        it('should be able to move a column right before another column', () => {
            const {
                prevConfig, A, B, C,
            } = getTestDataSet1();
            const columnConfig = prevConfig[C.key];
            const targetColumn = prevConfig[A.key];
            const targetPrevColumn: IColumnConfig = null;
            const targetNextColumn = prevConfig[B.key];
            const result = moveColumnRelativeToAnotherColumn({
                columnConfig, targetColumn, targetPrevColumn, targetNextColumn, position: 'top',
            });
            const expected = {
                fix: 'left', width: 10, isVisible: true, order: '5',
            };
            expect(result).toEqual(expected);
        });
    });

    describe('toggleAllColumnsVisibility', () => {
        it('should hide all columns except always visible ones', () => {
            const { prevConfig, columnsSorted } = getTestDataSet2();
            const result = toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: false });
            const expected = {
                1: { isVisible: false, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
                4: { isVisible: true, order: 'd', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });
});
