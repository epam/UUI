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
};

interface UseVirtualListProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount'>> {
    rowsCount: number;
    blockAlign?: number;
    onScroll?(value: Partial<UuiScrollPositionValues>): void;
};

export function useVirtualList<List extends HTMLElement = any, ScrollContainer extends HTMLElement = any>({
    onValueChange,
    value,
    rowsCount,
    onScroll,
    blockAlign = 20,
}: UseVirtualListProps): UseVirtualListApi<List, ScrollContainer> {
    const [estimatedHeight, setEstimatedHeight] = React.useState<number>(0);
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
        };
    }, [rowOffsets.current, scrollContainer.current, value?.focusedIndex]);

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current) return;
        const { scrollTop, clientHeight, ...scrollValues } = scrollContainer.current;
        onScroll?.({ ...scrollValues, scrollTop, clientHeight });

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[Math.min(topIndex + blockAlign, rowsCount)] < scrollTop) {
            topIndex += blockAlign;
        }

        let bottomIndex = topIndex;
        while (bottomIndex < rowsCount && rowOffsets.current[Math.min(bottomIndex, rowsCount)] < (scrollTop + clientHeight)) {
            bottomIndex++;
        }

        if (topIndex !== value.topIndex || (bottomIndex - topIndex) > value.visibleCount) {
            const visibleCount = bottomIndex - topIndex + blockAlign * 2;
            onValueChange({ ...value, topIndex, visibleCount });
        };
    }, [onValueChange, blockAlign, rowOffsets.current, rowsCount, value, onScroll, scrollContainer.current]);

    const listOffset = React.useMemo(() => {
        if (!listContainer.current) return undefined;
        return listContainer.current.offsetTop;
    }, [listContainer.current]);

    const updateRowHeights = React.useCallback(() => {
        if (!listContainer.current || (listContainer.current.offsetTop > 0 && !listOffset)) return;

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
        };

        const newEstimatedHeight = lastOffset - listOffset;
        if (estimatedHeight === newEstimatedHeight) return;
        setEstimatedHeight(newEstimatedHeight);
    }, [estimatedHeight, rowOffsets.current, rowsCount, value, listContainer.current, listOffset]);

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

    const offsetY = React.useMemo(() => {
        if (rowOffsets.current.length === 0) return 0;
        if (!value?.topIndex) return rowOffsets.current[0] - listOffset;
        return rowOffsets.current[value.topIndex] - listOffset;
    }, [rowOffsets.current, listOffset, value?.topIndex]);

    return {
        estimatedHeight,
        offsetY,
        scrollContainerRef: scrollContainer,
        listContainerRef: listContainer,
        handleScroll,
        scrollToIndex,
        listOffset
    };
};