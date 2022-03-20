import * as React from "react";
import type { IEditable, DataTableState } from '../';

interface UuiScrollPositionValues {
    scrollTop: number;
    clientHeight: number;
};

interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    listOffset: number;
    estimatedHeight: number;
    handleScroll: React.DOMAttributes<ScrollContainer>['onScroll'];
    listContainerRef: React.MutableRefObject<List>;
    scrollContainerRef: React.MutableRefObject<ScrollContainer>;
    scrollToIndex(index: number): void;
}

interface UseVirtualListProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount'>> {
    /** Number of rows in the list */
    rowsCount: number;

    /** Virtual list will align topIndex and visibleCount to the block size.
     * E.g. with block size = 10, even if we have rows 2 to 12 visible, the range will be aligned to 0-20
     * This is done to not re-render rows on each scroll.
     * When scrolling, re-render will happen only when we scroll over the next blockSize rows.
     * Default is 20.
     */
    blockSize?: number;

    /** Number of rows to draw before the top and after the bottom of the list.
     * This is required to hide blank areas while scrolling.
     * Default is 20.
     */
    overdrawRows?: number;

    onScroll?(value: Partial<UuiScrollPositionValues>): void;
}

export function useVirtualList<List extends HTMLElement = any, ScrollContainer extends HTMLElement = any>({
    onValueChange,
    value,
    rowsCount,
    onScroll,
    blockSize = 20,
    overdrawRows = 20,
}: UseVirtualListProps): UseVirtualListApi<List, ScrollContainer> {
    const [estimatedHeight, setEstimatedHeight] = React.useState<number>(0);
    const [listOffset, setListOffset] = React.useState<number>();
    const listContainer = React.useRef<List>();
    const scrollContainer = React.useRef<ScrollContainer>();
    const rowHeights = React.useRef<number[]>([]);
    const rowOffsets = React.useRef<number[]>([]);

    const updateScrollToFocus = React.useCallback(() => {
        if (!scrollContainer.current) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        const focusCoord = value?.focusedIndex && rowOffsets.current[value.focusedIndex] || 0;
        const rowHeight =  value?.focusedIndex && rowHeights.current[value.focusedIndex] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollContainer.current.scrollTo({ top: focusCoord - clientHeight / 2 + rowHeight / 2, behavior: 'smooth' });
        }
    }, [rowOffsets.current, scrollContainer.current, value?.focusedIndex]);

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current) return;
        const { scrollTop, clientHeight, ...scrollValues } = scrollContainer.current;
        onScroll?.({ ...scrollValues, scrollTop, clientHeight });

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[topIndex] < scrollTop) {
            topIndex += 1;
        }

        topIndex = topIndex - overdrawRows; // draw more rows at the top to remove visible blank areas while scrolling up
        topIndex = Math.floor(topIndex / blockSize) * blockSize; // Align to blockSize
        topIndex = Math.max(0, topIndex);

        let bottomIndex = topIndex;
        let scrollBottom = scrollTop + clientHeight
        while (bottomIndex < rowsCount && rowOffsets.current[bottomIndex] < scrollBottom) {
            bottomIndex++;
        }

        bottomIndex = bottomIndex + overdrawRows; // draw more rows at the bottom to remove visible blank areas while scrolling down
        bottomIndex = Math.floor(bottomIndex / blockSize) * blockSize; // Align to block size
        bottomIndex = Math.min(bottomIndex, rowsCount) // clamp to rowsCount

        const visibleCount = bottomIndex - topIndex;

        if (topIndex !== value.topIndex || visibleCount > value.visibleCount) {
            onValueChange({ ...value, topIndex, visibleCount });
        }
    }, [onValueChange, blockSize, rowOffsets.current, rowsCount, value, onScroll, scrollContainer.current]);

    const updateRowHeights = React.useCallback(() => {
        if (!scrollContainer.current || !listContainer.current || listOffset == null) return;

        Array.from(listContainer.current.children).forEach((node, index) => {
            const topIndex = value?.topIndex || 0;
            const { height } =  node.getBoundingClientRect();
            if (!height) return;
            rowHeights.current[topIndex + index] = height;
        });

        const averageHeight = rowHeights.current.length === 0 ?
            rowHeights.current.length + 1 :
            rowHeights.current.reduce((sum, next) => sum + next, 0) / rowHeights.current.length;

        rowOffsets.current = [];
        let lastOffset = listOffset;
        for (let n = 0; n < rowsCount; n++) {
            rowOffsets.current[n] = lastOffset;
            lastOffset += rowHeights.current[n] || averageHeight;
        }

        const newEstimatedHeight = lastOffset - listOffset;
        if (estimatedHeight === newEstimatedHeight) return;
        setEstimatedHeight(newEstimatedHeight);
    }, [estimatedHeight, rowOffsets.current, rowsCount, value, listContainer.current, scrollContainer.current, listOffset]);

    const scrollToIndex = React.useCallback((focusedIndex: number) => {
        if (!value?.focusedIndex) return;
        if (focusedIndex < 0) throw new Error('Index is less than zero');
        if (focusedIndex > rowsCount) throw new Error('Index exceeds the size of the list');
        onValueChange({ ...value, focusedIndex });
    }, [value?.focusedIndex, rowsCount, value]);

    React.useLayoutEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    React.useLayoutEffect(updateScrollToFocus, [value?.focusedIndex]);

    React.useLayoutEffect(() => {
        if (!scrollContainer.current || !listContainer.current) return;
        const { top: scrollContainerTop } = scrollContainer.current.getBoundingClientRect();
        const { top: listContainerTop } = listContainer.current.getBoundingClientRect();
        setListOffset(listContainerTop - scrollContainerTop);
    }, [scrollContainer.current, listContainer.current]);

    const offsetY = React.useMemo(() => {
        if (rowOffsets.current.length === 0) return 0;
        return rowOffsets.current[value.topIndex] - listOffset;
    }, [rowOffsets.current, listOffset, value?.topIndex]);

    return {
        estimatedHeight,
        offsetY,
        scrollContainerRef: scrollContainer,
        listContainerRef: listContainer,
        handleScroll,
        scrollToIndex,
        listOffset,
    };
}