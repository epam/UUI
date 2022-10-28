import {
    moveColumnRelativeToAnotherColumn, toggleAllColumnsVisibility,
    toggleSingleColumnPin,
    toggleSingleColumnVisibility,
} from '../columnsActions';
import { ColumnsConfig, IColumnConfig } from '@epam/uui-core';
import { GroupedDataColumnProps } from "../types";

function getTestDataSet1() {
    const A: GroupedDataColumnProps = { key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10, groupKey: 'displayedPinned' };
    const B: GroupedDataColumnProps = { key: '2', caption: 'b', isAlwaysVisible: true, width: 10, groupKey: 'displayedUnpinned' };
    const C: GroupedDataColumnProps = { key: '3', caption: 'A', isAlwaysVisible: false, width: 10, groupKey: 'hidden' };
    const columnsSorted: GroupedDataColumnProps[] = [A, B, C];
    const prevConfig: ColumnsConfig = {
        [A.key]: { fix: 'left', width: 10, isVisible: true, order: 'a' } as IColumnConfig,
        [B.key]: { width: 10, isVisible: true, order: 'b' } as IColumnConfig,
        [C.key]: { width: 10, isVisible: false, order: 'c' } as IColumnConfig,
    };
    return { prevConfig, columnsSorted, A, B, C };
}

describe('columnsActionsService', () => {
    describe('toggleSingleColumnVisibility', () => {
        it('should hide visible column', () => {
            const { prevConfig, columnsSorted, A } = getTestDataSet1();
            const result = toggleSingleColumnVisibility({ columnKey: A.key, prevConfig, columnsSorted });
            const expected = {
                1: { isVisible: false, order: 'bh', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
        it('should show hidden column', () => {
            const { prevConfig, columnsSorted, C } = getTestDataSet1();
            const result = toggleSingleColumnVisibility({ columnKey: C.key, prevConfig, columnsSorted });
            const expected = {
                1: { fix: 'left', isVisible: true, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: true, order: 'bh', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('toggleSingleColumnPin', () => {
        it('should pin a visible column', () => {
            const { prevConfig, columnsSorted, B } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: B.key, prevConfig, columnsSorted });
            const expected = {
                1: { fix: 'left', isVisible: true, order: 'a', width: 10 },
                2: { fix: 'left', isVisible: true, order: 'ah', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });

        it('should unpin a visible column', () => {
            const { prevConfig, columnsSorted, A } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: A.key, prevConfig, columnsSorted });
            const expected = {
                1: { isVisible: true, order: 'ah', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });

        it('should pin a hidden column and automatically make it visible', () => {
            const { prevConfig, columnsSorted, C } = getTestDataSet1();
            const result = toggleSingleColumnPin({ columnKey: C.key, prevConfig, columnsSorted });
            const expected = {
                1: { fix: 'left', isVisible: true, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { fix: 'left', isVisible: true, order: 'ah', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('moveColumnRelativeToAnotherColumn', () => {
        it('should be able to move a column right under another column', () => {
            const { prevConfig, A, C, B } = getTestDataSet1();
            const columnConfig = prevConfig[A.key];
            const targetColumn = prevConfig[C.key];
            const targetNextColumn: IColumnConfig = null;
            const targetPrevColumn = prevConfig[B.key];
            const result = moveColumnRelativeToAnotherColumn({ columnConfig, targetColumn, targetNextColumn, targetPrevColumn, position: 'bottom' });
            const expected = { isVisible: false, order: 'n', width: 10 };
            expect(result).toEqual(expected);
        });
        it('should be able to move a column right before another column', () => {
            const { prevConfig, A, B, C } = getTestDataSet1();
            const columnConfig = prevConfig[C.key];
            const targetColumn = prevConfig[A.key];
            const targetPrevColumn: IColumnConfig = null;
            const targetNextColumn = prevConfig[B.key];
            const result = moveColumnRelativeToAnotherColumn({ columnConfig, targetColumn, targetPrevColumn, targetNextColumn, position: 'top' });
            const expected = { fix: 'left', width: 10, isVisible: true, order: '5' };
            expect(result).toEqual(expected);
        });
    });

    describe('toggleAllColumnsVisibility', () => {
        it('should hide all columns except always visible ones', () => {
            const { prevConfig, columnsSorted } = getTestDataSet1();
            const result = toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: false });
            const expected = {
                1: { isVisible: false, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });
});
