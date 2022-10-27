import {
    moveColumnRelativeToAnotherColumn, toggleAllColumnsVisibility,
    toggleSingleColumnPin,
    toggleSingleColumnVisibility,
} from '../columnsActionsService';
import { ColumnsConfig, DataColumnProps } from '@epam/uui-core';

function getTestDataSet1() {
    const A = { key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10 };
    const B = { key: '2', caption: 'b', isAlwaysVisible: true, width: 10 };
    const C = { key: '3', caption: 'A', isAlwaysVisible: false, width: 10 };
    const columnsSorted: DataColumnProps[] = [A, B, C];
    const prevConfig: ColumnsConfig = {
        [A.key]: { fix: 'left', width: 10, isVisible: true, order: 'a' },
        [B.key]: { width: 10, isVisible: true, order: 'b' },
        [C.key]: { width: 10, isVisible: false, order: 'c' },
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
            const { prevConfig, columnsSorted, A, C } = getTestDataSet1();
            const result = moveColumnRelativeToAnotherColumn({ prevConfig, columnsSorted, columnKey: A.key, targetColumnKey: C.key, isAfterTarget: true });
            const expected = {
                1: { isVisible: false, order: 'n', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('toggleAllColumnsVisibility', () => {
        it('should hide all columns except always visible ones', () => {
            const { prevConfig, columnsSorted } = getTestDataSet1();
            const result = toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, isToggleOn: false });
            const expected = {
                1: { isVisible: false, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });
});
