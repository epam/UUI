import { DOMAttributes, MutableRefObject, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import type { IEditable, DataTableState } from '../';

interface UuiScrollPositionValues {
    scrollTop: number;
    clientHeight: number;
};

interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    listOffset: number;
    estimatedHeight: number;
    handleScroll: DOMAttributes<ScrollContainer>['onScroll'];
    listContainer: MutableRefObject<List>;
    scrollContainer: MutableRefObject<ScrollContainer>;
    scrollToIndex(index: number): void;
};

interface UseVirtualListProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount'>> {
    rowsCount: number;
    blockAlign?: number;
    onScroll?(value: Partial<UuiScrollPositionValues>): void;
};

export function useVirtualList<List extends HTMLElement = HTMLDivElement, ScrollContainer extends HTMLElement = HTMLDivElement>({
    onValueChange,
    value,
    rowsCount,
    onScroll,
    blockAlign = 20
}: UseVirtualListProps): UseVirtualListApi<List, ScrollContainer> {
    const estimatedHeight = useRef(0);
    const listContainer = useRef<List>();
    const scrollContainer = useRef<ScrollContainer>();
    const rowHeights = useRef<number[]>([]);
    const rowOffsets = useRef<number[]>([]);

    const updateScrollToFocus = useCallback(() => {
        if (!scrollContainer.current) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        const focusCoord = value?.focusedIndex && rowOffsets.current[value.focusedIndex] || 0;
        const rowHeight =  value?.focusedIndex && rowHeights.current[value.focusedIndex] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollContainer.current.scrollTo({ top: focusCoord - clientHeight / 2 + rowHeight / 2, behavior: 'smooth' });
        };
    }, [rowOffsets.current, scrollContainer.current, value?.focusedIndex]);

    const handleScroll = useCallback(() => {
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

    const listOffset = useMemo(() => {
        if (!listContainer.current) return 0;
        return listContainer.current.offsetTop;
    }, [listContainer.current]);

    const updateRowHeights = useCallback(() => {
        if (!listContainer.current) return;
        const nodes = Array.from(listContainer.current.children);
        const topIndex = value?.topIndex || 0;

        nodes.forEach((node, index) => {
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

        estimatedHeight.current = lastOffset - listOffset;
    }, [estimatedHeight.current, rowOffsets.current, rowsCount, listContainer.current, listOffset]);

    const scrollToIndex = useCallback((focusedIndex: number) => {
        if (!value?.focusedIndex) return;
        if (focusedIndex < 0) throw new Error('Index is less than zero');
        if (focusedIndex > rowsCount) throw new Error('Index exceeds the size of the list');
        onValueChange({ ...value, focusedIndex });
    }, [value?.focusedIndex, rowsCount]);

    useLayoutEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    useLayoutEffect(updateScrollToFocus, [value?.focusedIndex]);

    const offsetY = useMemo(() => {
        if (rowOffsets.current.length === 0) return 0;
        if (!value?.topIndex) return rowOffsets.current[0] - listOffset;
        return rowOffsets.current[value.topIndex] - listOffset;
    }, [rowOffsets.current, listOffset, value?.topIndex]);

    return {
        estimatedHeight: estimatedHeight.current,
        offsetY,
        scrollContainer,
        listContainer,
        handleScroll,
        scrollToIndex,
        listOffset
    };
};