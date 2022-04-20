import * as React from "react";
import type { IEditable } from '../';
import { VirtualListState } from "../";

interface UuiScrollPositionValues {
    scrollTop: number;
    clientHeight: number;
}

interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    listOffset: number;
    estimatedHeight: number;
    handleScroll: React.DOMAttributes<ScrollContainer>['onScroll'];
    listContainerRef: React.MutableRefObject<List>;
    scrollContainerRef: React.MutableRefObject<ScrollContainer>;
    scrollToIndex(index: number, behavior: ScrollBehavior): void;
}

interface UseVirtualListProps extends IEditable<VirtualListState> {
    rowsCount: number;
    blockAlign?: number;
    onScroll?(value: Partial<UuiScrollPositionValues>): void;
}

export function useVirtualList<List extends HTMLElement = any, ScrollContainer extends HTMLElement = any>({
    onValueChange,
    value,
    rowsCount,
    onScroll,
    blockAlign = 20,
}: UseVirtualListProps): UseVirtualListApi<List, ScrollContainer> {
    const [estimatedHeight, setEstimatedHeight] = React.useState<number>(0);
    const [listOffset, setListOffset] = React.useState<number>();
    const listContainer = React.useRef<List>();
    const scrollContainer = React.useRef<ScrollContainer>();
    const rowHeights = React.useRef<number[]>([]);
    const rowOffsets = React.useRef<number[]>([]);

    const handleScrollToFocus = () => {
        if (!scrollContainer.current || !value) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        const focusedIndexOffset = rowOffsets.current[value.focusedIndex] || 0;
        const focusedIndexHeight =  rowHeights.current[value.focusedIndex] || 0;
        const scrollBottom = scrollTop + clientHeight - listOffset;
        if (focusedIndexOffset < scrollTop || scrollBottom < (focusedIndexOffset + focusedIndexHeight)) {
            const middleOffset = focusedIndexOffset - clientHeight / 2 + focusedIndexHeight / 2;
            const indexToScroll = rowOffsets.current.findIndex(rowOffset => middleOffset <= rowOffset);
            scrollToIndex(indexToScroll, 'smooth');
        }
    };

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current || !value) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        onScroll?.(scrollContainer.current);
        const scrollBottom = scrollTop + clientHeight - listOffset;

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[Math.min(topIndex + blockAlign, rowsCount)] < scrollTop) {
            topIndex += blockAlign;
        }
        let firstVisible = topIndex;
        while ((scrollTop + listOffset) > rowOffsets.current[firstVisible]) {
            firstVisible += 1;
        }
        let bottomIndex = topIndex;
        while (bottomIndex < rowsCount && rowOffsets.current[bottomIndex] < scrollBottom) {
            bottomIndex++;
        }
        if (value.indexToScroll != null && firstVisible !== topIndex) {
            onValueChange({ ...value, indexToScroll: null });
        }

        if (topIndex !== value.topIndex || (bottomIndex - topIndex) > value.visibleCount) {
            const visibleCount = bottomIndex - topIndex + blockAlign * 2;
            onValueChange({ ...value, topIndex, visibleCount, indexToScroll: null });
        }
    }, [onValueChange, blockAlign, rowOffsets.current, rowsCount, value, onScroll, scrollContainer.current]);

    const updateRowHeights = React.useCallback(() => {
        if (!scrollContainer.current || !listContainer.current || listOffset == null || !value) return;

        Array.from(listContainer.current.children).forEach((node, index) => {
            const topIndex = value.topIndex || 0;
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

    React.useLayoutEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    const handleScrollToIndex = () => {
        if (
            !scrollContainer.current ||
            !value ||
            value.indexToScroll == null
        ) return;
        scrollToIndex(value.indexToScroll);
    };

    const scrollToIndex = React.useCallback((index: number, behavior?: ScrollBehavior) => {
        const indexToScroll = Math.min(index, rowsCount - 1);
        const topCoordinate = rowOffsets.current[indexToScroll] - listOffset;
        scrollContainer.current.scrollTo({ top: topCoordinate, behavior});
    }, [scrollContainer.current, rowOffsets.current]);

    React.useLayoutEffect(handleScrollToIndex, [value?.indexToScroll]);
    React.useLayoutEffect(handleScrollToFocus, [value?.focusedIndex]);

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