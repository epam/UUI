import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IEditable, DataTableState } from '..';

interface UuiScrollPositionValues {
    scrollTop: number;
    clientHeight: number;
};

interface UuiScrollbarsApi<ScrollContainer> {
    getValues: () => UuiScrollPositionValues;
    container: ScrollContainer;
    scrollTop: (top: number) => void;
};

interface UuiScrollContainerApi<ScrollContainer> {
    setRef: (scrollbars: ScrollContainer) => void;
    api: UuiScrollbarsApi<ScrollContainer>;
};

interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    listOffset: number;
    estimatedHeight: number;
    handleScroll: () => void;
    listContainer: MutableRefObject<List>;
    scrollContainer: UuiScrollContainerApi<ScrollContainer>;
    scrollToIndex: (index: number) => void;
};

interface UseVirtualListProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount'>> {
    rowsCount: number;
    blockAlign?: number;
    onScroll?(value: Partial<UuiScrollPositionValues>): void;
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
    const listContainer = useRef<List>();
    const scrollContainerApi = useRef<UuiScrollbarsApi<ScrollContainer>>();
    const rowHeights = useRef<number[]>([]);
    const rowOffsets = useRef<number[]>([]);

    const scrollContainer = useMemo<UuiScrollContainerApi<ScrollContainer>>(() => ({
        api: scrollContainerApi.current,
        setRef: container => {
            if (!container) return;
            scrollContainerApi.current = {
                container,
                scrollTop: top => container.scrollTo({ top, behavior: 'smooth' }),
                getValues: () => ({
                    scrollTop: container.scrollTop,
                    clientHeight: container.clientHeight,
                })
            }
        }
    }), [scrollContainerApi.current]);

    const updateScrollToFocus = useCallback(() => {
        if (focused == undefined || !scrollContainer?.api) return;
        const { scrollTop, clientHeight } = scrollContainer.api.getValues();
        const focusCoord = focused && rowOffsets.current[focused] || 0;
        const rowHeight = focused && rowHeights.current[focused] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollContainer.api.scrollTop(focusCoord - clientHeight / 2 + rowHeight / 2);
        };
    }, [rowOffsets.current, scrollContainer?.api, focused]);

    const handleScroll = useCallback(() => {
        if (!scrollContainer?.api) return;
        const { scrollTop, clientHeight, ...scrollValues } = scrollContainer.api.getValues();
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
    }, [onValueChange, blockAlign, rowOffsets.current, rowsCount, value, onScroll, scrollContainer?.api]);

    const listOffset = useMemo(() => {
        if (!listContainer.current || !scrollContainer?.api) return 0;
        const wrapperHeight = scrollContainer.api.container.scrollHeight;
        const offsetHeight = listContainer.current.scrollHeight;
        return wrapperHeight - offsetHeight;
    }, [listContainer.current, scrollContainer?.api?.container]);

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

       estimatedHeight.current = lastOffset;
    }, [estimatedHeight.current, rowOffsets.current, rowsCount, listContainer.current]);

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
        scrollContainer,
        listContainer,
        handleScroll,
        scrollToIndex,
        listOffset
    };
};