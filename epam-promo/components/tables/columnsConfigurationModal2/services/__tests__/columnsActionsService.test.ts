import {
    moveColumnRelativeToAnotherColumn, toggleColumnsVisibility,
    togglePinOfAColumn,
    toggleVisibilityOfAColumn,
} from '../columnsActionsService';
import { ColGroup } from '../types';
import { ColumnsConfig, DataColumnProps } from '@epam/uui-core';

function getTestDataSet1() {
    const A = { key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10 };
    const B = { key: '2', caption: 'b', isAlwaysVisible: true, width: 10 };
    const C = { key: '3', caption: 'A', isAlwaysVisible: false, width: 10 };
    const columnsSorted: DataColumnProps[] = [A, B, C];
    const byGroup = {
        [ColGroup.DISPLAYED_PINNED.toString()]: { items: [A], itemsFiltered: [A] },
        [ColGroup.DISPLAYED_UNPINNED.toString()]: { items: [B], itemsFiltered: [B] },
        [ColGroup.HIDDEN.toString()]: { items: [C], itemsFiltered: [C] },
    };
    const prevConfig: ColumnsConfig = {
        [A.key]: { fix: 'left', width: 10, isVisible: true, order: 'a' },
        [B.key]: { width: 10, isVisible: true, order: 'b' },
        [C.key]: { width: 10, isVisible: false, order: 'c' },
    };
    return { prevConfig, columnsSorted, byGroup, A, B, C };
}

describe('columnsActionsService', () => {
    describe('toggleVisibilityOfAColumn', () => {
        it('should hide column', () => {
            const { prevConfig, columnsSorted, byGroup, A } = getTestDataSet1();
            const result = toggleVisibilityOfAColumn({ columnKey: A.key, prevConfig, columnsSorted, byGroup });
            const expected = {
                1: { isVisible: false, order: 'bh', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
        it('shouldn\'t hide column which is always visible', () => {
            const { prevConfig, columnsSorted, byGroup, B } = getTestDataSet1();
            const result = toggleVisibilityOfAColumn({ columnKey: B.key, prevConfig, columnsSorted, byGroup });
            const expected = {
                1: { fix: 'left', isVisible: true, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('togglePinOfAColumn', () => {
        it('should pin a column', () => {
            const { prevConfig, columnsSorted, byGroup, B } = getTestDataSet1();
            const result = togglePinOfAColumn({ columnKey: B.key, prevConfig, columnsSorted, byGroup });
            const expected = {
                1: { fix: 'left', isVisible: true, order: 'a', width: 10 },
                2: { fix: 'left', isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
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

    describe('toggleColumnsVisibility', () => {
        it('should hide all columns except always visible ones', () => {
            const { prevConfig, columnsSorted } = getTestDataSet1();
            const result = toggleColumnsVisibility({ prevConfig, columns: columnsSorted, isToggleOn: false });
            const expected = {
                1: { isVisible: false, order: 'a', width: 10 },
                2: { isVisible: true, order: 'b', width: 10 },
                3: { isVisible: false, order: 'c', width: 10 },
            };
            expect(result).toEqual(expected);
        });
    });
});
