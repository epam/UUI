import { VirtualListState } from '../../../types';
import { getAverageRowHeight, getUpdatedRowHeights } from '../../useVirtualList/utils';
import { VirtualListInfo } from '../../useVirtualList/VirtualListInfo';
import { createListContainer, createScrollContainer } from './helpers';

describe('getUpdatedRowHeights', () => {
    const scrollContainer = createScrollContainer();
    const creaateVirtualListInfo = (
        listContainer: HTMLDivElement,
        value: VirtualListState,
        rowHeights: number[],
    ) => new VirtualListInfo(
        scrollContainer,
        listContainer,
        value,
        100,
        20,
        20,
        rowHeights,
        [],
        10,
    );
    it('should update row heights, starting from topIndex', () => {
        const listContainer = createListContainer([5, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(listContainer, { topIndex: 2 }, []);
        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([undefined, undefined, 5, 7, 10]);
    });

    it('should update existing row heights', () => {
        const listContainer = createListContainer([6, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(
            listContainer,
            { topIndex: 2 },
            [5, 5, 5, 5, 5, 5, 5, 5],
        );

        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([5, 5, 6, 7, 10, 5, 5, 5]);
    });

    it('should update row heigts from 0 if no topIndex was provided', () => {
        const listContainer = createListContainer([6, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(
            listContainer,
            {},
            [5, 5, 5, 5, 5, 5, 5, 5],
        );

        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([6, 7, 10, 5, 5, 5, 5, 5]);
    });
});

describe('getAverageRowHeight', () => {
    it('should calculate average row height', () => {
        expect(getAverageRowHeight([1, 3, 5, 7])).toBe(4);
    });

    it('should ignore undefined values', () => {
        expect(getAverageRowHeight([1, 3, undefined, 5, undefined, 7])).toBe(4);
    });

    it('should return 1 for empty array', () => {
        expect(getAverageRowHeight([])).toBe(1);
    });

    it('should return 1 for array without not empty values', () => {
        expect(getAverageRowHeight([undefined, undefined])).toBe(1);
    });
});
