import * as React from "react";
import type { IEditable, DataTableState } from '../';
import { isValueWithinRange } from '../helpers';
import debounce from "lodash.debounce";

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
    scrollToIndex(index: number): void;
}

interface UseVirtualListProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount' | 'indexToScroll'>> {
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
    const visibleIndexesRange = React.useRef<[number, number]>([0, 0]);

    const getVisibleIndexesRange = (): [number, number] => {
        const { scrollTop, clientHeight } = scrollContainer.current;
        let firstVisibleIndex = value.topIndex;
        while (scrollTop + listOffset > rowOffsets.current[firstVisibleIndex]) {
            firstVisibleIndex += 1;
        }
        let bottomVisibleIndex = firstVisibleIndex || 0;
        const scrollBottom = Math.round(scrollTop) + clientHeight - listOffset;

        while (
            (rowOffsets.current[bottomVisibleIndex] + rowHeights.current[bottomVisibleIndex]) <= scrollBottom
            && bottomVisibleIndex !== (rowOffsets.current.length - 1)
            ) {
            bottomVisibleIndex += 1;
        }
        return [firstVisibleIndex, bottomVisibleIndex];
    };

    const handleScrollToFocus = React.useCallback(() => {
        if (!scrollContainer.current || !value) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        const focusCoord = rowOffsets.current[value.focusedIndex] || 0;
        const rowHeight =  rowHeights.current[value.focusedIndex] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollContainer.current.scrollTo({ top: focusCoord - clientHeight / 2 + rowHeight / 2, behavior: 'smooth' });
        }
    }, [rowOffsets.current, scrollContainer.current, value?.focusedIndex]);

    const onHandleScrollEnd = React.useMemo(
        () =>
            debounce(() => {
                if (!value || value.indexToScroll == null) return;
                const isTargetIndex = value.indexToScroll === visibleIndexesRange.current[0] || visibleIndexesRange.current[1] === value.indexToScroll;
                if (
                    isTargetIndex
                    && value.indexToScroll <= (rowOffsets.current.length - 1)
                ) {
                    onValueChange({...value, indexToScroll: - 1});
                }

            }, 100),
        [onValueChange, scrollContainer.current, value, rowOffsets.current, visibleIndexesRange.current],
    );

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current || !value) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        onScroll?.(scrollContainer.current);

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[Math.min(topIndex + blockAlign, rowsCount)] < scrollTop) {
            topIndex += blockAlign;
        }

        let bottomIndex = topIndex;
        while (bottomIndex < rowsCount && rowOffsets.current[Math.min(bottomIndex, rowsCount)] < (scrollTop + clientHeight)) {
            bottomIndex++;
        }
        const updatedRange = getVisibleIndexesRange();
        if (updatedRange[0] !== visibleIndexesRange.current[0] || updatedRange[1] !== visibleIndexesRange.current[1]) {
            visibleIndexesRange.current = updatedRange;
        }

        if (topIndex !== value.topIndex || (bottomIndex - topIndex) > value.visibleCount) {
            const visibleCount = bottomIndex - topIndex + blockAlign * 2;
            onValueChange({ ...value, topIndex, visibleCount });
        }
        onHandleScrollEnd();
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

    const handleScrollToIndex = () => {
        if (!scrollContainer.current || !value || value.indexToScroll == null) return;
        const isIndexWithinRange = isValueWithinRange(value.indexToScroll, visibleIndexesRange.current);
        const shouldScroll = value.indexToScroll >= 0 && !isIndexWithinRange;
        if (!shouldScroll) return;
        const isLoadMoreItems = value.indexToScroll >= rowOffsets.current.length;
        const indexToScroll = isLoadMoreItems ? rowOffsets.current.length - 1 : value.indexToScroll;
        const topCoordinate = rowOffsets.current[indexToScroll] - listOffset;
        scrollContainer.current.scrollTo({ top: topCoordinate, behavior: 'smooth'});
    };

    React.useLayoutEffect(handleScrollToIndex, [value?.indexToScroll, scrollContainer.current, rowOffsets.current.length, rowOffsets.current[value?.indexToScroll]]);
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