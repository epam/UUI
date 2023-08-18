import { getUpdatedRowHeights } from '../../useVirtualList/utils';
import { VirtualListInfo } from '../../useVirtualList/VirtualListInfo';
import { createListContainer, createScrollContainer } from './helpers';

describe('getUpdatedRowHeights', () => {
    const scrollContainer = createScrollContainer();
    it('should update row heights', () => {
        const listContainer = createListContainer([5, 7, 10]);
        const virtualListInfo = new VirtualListInfo(
            scrollContainer,
            listContainer,
            { topIndex: 2 },
            100,
            20,
            20,
            [],
            [],
            10,
        );

        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([undefined, undefined, 5, 7, 10]);
    });
});
