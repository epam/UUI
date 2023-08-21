import { VirtualListState } from '../../../types';
import { getUpdatedRowHeights } from '../../useVirtualList/utils';
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
