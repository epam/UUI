import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PositionValues, ScrollbarsApi } from '@epam/uui-components';
import type { IEditable, DataTableState } from '..';

interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    estimatedHeight: number;
    handleScroll: () => void;
    listRef: MutableRefObject<List>;
    scrollbarsRef: MutableRefObject<ScrollbarsApi>;
    scrollContainerRef: MutableRefObject<ScrollContainer>;
    scrollToIndex: (index: number) => void;
};

interface UseVirtualListProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount'>> {
    rowsCount: number;
    blockAlign?: number;
    onScroll?(value: Partial<PositionValues>): void;
};

export function useVirtualList<
    List extends HTMLElement,
    ScrollContainer extends HTMLElement
>({
    onValueChange,
    value,
    rowsCount,
    onScroll,
    blockAlign = 20
}: UseVirtualListProps): UseVirtualListApi<List, ScrollContainer> {
    const [focused, setFocused] = useState(value?.focusedIndex || 0);
    const estimatedHeight = useRef(0);
    const listRef = useRef<List>();
    const scrollContainerRef = useRef<ScrollContainer>();
    const scrollbarsRef = useRef<ScrollbarsApi>();
    const rowHeights = useRef<number[]>([]);
    const rowOffsets = useRef<number[]>([]);

    const updateScrollToFocus = useCallback(() => {
        if (!scrollbarsRef.current || focused == undefined) return;
        const { scrollTop, clientHeight } = scrollbarsRef.current.getValues();
        const focusCoord = focused && rowOffsets.current[focused] || 0;
        const rowHeight = focused && rowHeights.current[focused] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollbarsRef.current.scrollTop(focusCoord - clientHeight / 2 + rowHeight / 2);
        };
    }, [rowOffsets.current, scrollbarsRef.current, focused]);

    const handleScroll = useCallback(() => {
        if (!scrollbarsRef.current) return;
        if (onScroll) onScroll(scrollbarsRef.current.getValues());
        const { scrollTop, clientHeight } = scrollbarsRef.current.getValues();

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
    }, [onValueChange, blockAlign, rowOffsets.current, rowsCount, value, onScroll, scrollbarsRef.current]);

    const listOffset = useMemo(() => {
        if (!listRef.current || !scrollContainerRef.current) return 0;
        const wrapperHeight = scrollContainerRef.current.clientHeight;
        const offsetHeight = listRef.current.clientHeight;
        return wrapperHeight - offsetHeight;
    }, [listRef.current, scrollContainerRef.current]);

    const updateRowHeights = useCallback(() => {
        if (!listRef.current || !scrollbarsRef.current) return;
        const nodes = Array.from(listRef.current.children);
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

       estimatedHeight.current = lastOffset;
    }, [estimatedHeight.current, rowOffsets.current, rowsCount, listRef.current, scrollbarsRef.current, listOffset]);

    const scrollToIndex = useCallback((index: number) => {
        if (index < 0) throw new Error('Index is less than zero');
        if (index > rowsCount) throw new Error('Index exceeds the size of the list');
        setFocused(index);
        setTimeout(() => setFocused(undefined), 0);
    }, [focused]);

    useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    useEffect(updateScrollToFocus, [focused]);

    const offsetY = useMemo(() => {
        if (rowOffsets.current.length === 0) return 0;
        if (!value.topIndex) return rowOffsets.current[0] - listOffset;
        return rowOffsets.current[value.topIndex] - listOffset;
    }, [rowOffsets.current, listOffset, value?.topIndex]);

    return {
        estimatedHeight: estimatedHeight.current,
        offsetY,
        scrollbarsRef,
        scrollContainerRef,
        listRef,
        handleScroll,
        scrollToIndex
    };
};