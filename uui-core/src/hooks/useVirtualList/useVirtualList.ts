import * as React from 'react';
import type { ScrollToConfig } from '../../types';
import { useLayoutEffectSafeForSsr } from '../../ssr';
import { getRowsToFetchForScroll, getUpdatedRowsInfo, getTopCoordinate } from './virtualListUtils';
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

    const getTopIndexAndVisibleCountOnScroll = (virtualListInfo: VirtualListInfo) => {
        if (!virtualListInfo.scrollContainer || !virtualListInfo.value) {
            return { visibleCount: virtualListInfo.value.visibleCount, topIndex: virtualListInfo.value.topIndex };
        }

        return getRowsToFetchForScroll(virtualListInfo);
    };

    useLayoutEffectSafeForSsr(() => {
        const rowsInfo = getUpdatedRowsInfo(getVirtualListInfo());
        rowHeights.current = rowsInfo.rowHeights;
        rowOffsets.current = rowsInfo.rowOffsets;

        if (scrollContainer.current && value) onScroll?.(scrollContainer.current);

        if (value?.scrollTo !== scrolledTo && value.scrollTo?.index != null) {
            const { topIndex = 0, visibleCount = 0 } = value;
            const newEstimatedHeight = rowsInfo.estimatedContainerHeight
                    + (value.scrollTo.index - topIndex - visibleCount)
                    * rowsInfo.averageRowHeight;

            const estimatedHeightToSet = newEstimatedHeight > rowsInfo.estimatedContainerHeight
                ? newEstimatedHeight
                : rowsInfo.estimatedContainerHeight;

            setEstimatedHeight(estimatedHeightToSet);
            if (!scrollContainer.current || !value) return;

            scrollToIndex(value.scrollTo?.index);
        } else if (estimatedHeight !== rowsInfo.estimatedContainerHeight) {
            setEstimatedHeight(rowsInfo.estimatedContainerHeight);
            const { topIndex, visibleCount } = getTopIndexAndVisibleCountOnScroll(getVirtualListInfo());
            if (topIndex !== value.topIndex || visibleCount > value.visibleCount) {
                onValueChange({ ...value, topIndex, visibleCount });
            }
        }
    });

    useLayoutEffectSafeForSsr(() => {
        if (value.scrollTo?.index >= value.topIndex && value.scrollTo?.index <= value.topIndex + value.visibleCount) {
            setScrolledTo(value.scrollTo);
        }
    }, [value.topIndex, value.scrollTo?.index]);

    const scrollToIndex = React.useCallback(
        (index: number, behavior?: ScrollBehavior) => {
            const indexToScroll = index;
            const topCoordinate = getTopCoordinate(getVirtualListInfo(), indexToScroll);
            if (!isNaN(topCoordinate)) {
                scrollContainer.current.scrollTo({ top: topCoordinate, behavior });
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

        const { topIndex, visibleCount } = getTopIndexAndVisibleCountOnScroll(getVirtualListInfo());
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
