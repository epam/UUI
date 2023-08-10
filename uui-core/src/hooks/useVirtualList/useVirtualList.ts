import * as React from 'react';
import type { ScrollToConfig } from '../../types';
import { useLayoutEffectSafeForSsr } from '../../ssr';
import { getRowsToFetchForScroll, getUpdatedRowsInfo } from './virtualListUtils';
import { UseVirtualListProps, UseVirtualListApi } from './types';
import { VirtualListInfo } from './VirtualListInfo';

export function useVirtualList<List extends HTMLElement = any, ScrollContainer extends HTMLElement = any>(
    props: UseVirtualListProps,
): UseVirtualListApi<List, ScrollContainer> {
    const {
        onValueChange,
        value,
        rowsCount,
        onScroll,
        blockSize = 20,
        overdrawRows = 20,
    } = props;
    const [estimatedHeight, setEstimatedHeight] = React.useState<number>(0);
    const [listOffset, setListOffset] = React.useState<number>();
    const [scrolledTo, setScrolledTo] = React.useState<ScrollToConfig>(null);
    const listContainer = React.useRef<List>();
    const scrollContainer = React.useRef<ScrollContainer>();
    const rowHeights = React.useRef<number[]>([]);
    const rowOffsets = React.useRef<number[]>([]);

    const getVirtualListInfo = () => new VirtualListInfo(
        scrollContainer.current,
        listContainer.current,
        value,
        rowsCount,
        blockSize,
        overdrawRows,
        rowHeights.current,
        rowOffsets.current,
        listOffset,
        estimatedHeight,
    );

    useLayoutEffectSafeForSsr(() => {
        if (!scrollContainer.current || !listContainer.current) return;
        const { top: scrollContainerTop } = scrollContainer.current.getBoundingClientRect();
        const { top: listContainerTop } = listContainer.current.getBoundingClientRect();
        const newListOffset = listContainerTop - scrollContainerTop;
        setListOffset(newListOffset);
    }, [scrollContainer.current, listContainer.current]);

    const handleScrollToFocus = () => {
        if (!scrollContainer.current || !value) return;
        const { scrollTop, clientHeight } = scrollContainer.current;
        const focusedIndexOffset = rowOffsets.current[value.focusedIndex] || 0;
        const focusedIndexHeight = rowHeights.current[value.focusedIndex] || 0;
        const scrollBottom = scrollTop + clientHeight - listOffset;
        if (focusedIndexOffset < scrollTop - focusedIndexHeight || scrollBottom < focusedIndexOffset) {
            const middleOffset = focusedIndexOffset - clientHeight / 2 + focusedIndexHeight / 2;
            const indexToScroll = rowOffsets.current.findIndex((rowOffset) => middleOffset <= rowOffset);
            scrollToIndex(indexToScroll, 'smooth');
        }
    };

    const getTopIndexAndVisibleCountOnScroll = () => {
        if (!scrollContainer.current || !value) {
            return { visibleCount: value.visibleCount, topIndex: value.topIndex };
        }

        return getRowsToFetchForScroll(getVirtualListInfo());
    };

    useLayoutEffectSafeForSsr(() => {
        const rowsInfo = getUpdatedRowsInfo(getVirtualListInfo());
        rowHeights.current = rowsInfo.rowHeights;
        rowOffsets.current = rowsInfo.rowOffsets;
        if (estimatedHeight !== rowsInfo.estimatedContainerHeight) {
            setEstimatedHeight(rowsInfo.estimatedContainerHeight);
        }

        if (scrollContainer.current && value) onScroll?.(scrollContainer.current);

        const { topIndex, visibleCount } = getTopIndexAndVisibleCountOnScroll();
        if (topIndex !== value.topIndex || visibleCount > value.visibleCount) {
            onValueChange({ ...value, topIndex, visibleCount });
        }

        if (value?.scrollTo !== scrolledTo) {
            handleScrollToIndex();
        }
    });

    const handleScrollToIndex = () => {
        if (!scrollContainer.current || !value || value.scrollTo?.index == null) return;
        scrollToIndex(value.scrollTo?.index);
    };

    const scrollToIndex = React.useCallback(
        (index: number, behavior?: ScrollBehavior) => {
            const indexToScroll = Math.min(index, rowsCount - 1);
            const topCoordinate = rowOffsets.current[indexToScroll] - listOffset;
            if (!isNaN(topCoordinate)) {
                scrollContainer.current.scrollTo({ top: topCoordinate, behavior });
                setScrolledTo(value.scrollTo);
            }
        },
        [scrollContainer.current, rowOffsets.current],
    );

    useLayoutEffectSafeForSsr(() => {
        handleScrollToFocus();
    }, [value?.focusedIndex]);

    const offsetY = React.useMemo(() => {
        if (rowOffsets.current.length === 0) return 0;
        return rowOffsets.current[value.topIndex] - listOffset;
    }, [
        rowOffsets.current, listOffset, value?.topIndex,
    ]);

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current && !value) return;
        onScroll?.(scrollContainer.current);

        const { topIndex, visibleCount } = getTopIndexAndVisibleCountOnScroll();
        if (topIndex !== value.topIndex || visibleCount > value.visibleCount) {
            onValueChange({ ...value, topIndex, visibleCount });
        }
    }, [
        onValueChange, blockSize, rowOffsets.current, rowsCount, value, onScroll, scrollContainer.current,
    ]);

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
