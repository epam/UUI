import * as React from 'react';
import type { ScrollToConfig } from '../../types';
import { useLayoutEffectSafeForSsr } from '../../ssr';
import {
    getRowsToFetchForScroll, getUpdatedRowsInfo, assumeHeightForScrollToIndex,
    getTopIndexWithOffset, getOffsetYForIndex, getScrollToCoordinate,
} from './utils';
import { VirtualListInfo, UseVirtualListProps, UseVirtualListApi, RowsInfo } from './types';

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
        rowsSelector,
    } = props;
    const [estimatedHeight, setEstimatedHeight] = React.useState<number>(0);
    const [listOffset, setListOffset] = React.useState<number>();
    const [scrolledTo, setScrolledTo] = React.useState<ScrollToConfig>(null);
    const listContainer = React.useRef<List>();
    const scrollContainer = React.useRef<ScrollContainer>();
    const rowHeights = React.useRef<number[]>([]);
    const rowOffsets = React.useRef<number[]>([]);

    const getVirtualListInfo = (): VirtualListInfo => ({
        scrollContainer: scrollContainer.current,
        listContainer: listContainer.current,
        rowHeights: rowHeights.current,
        rowOffsets: rowOffsets.current,
        value,
        rowsCount,
        blockSize,
        overdrawRows,
        listOffset,
        estimatedHeight,
        rowsSelector,
    });

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
            scrollToIndex({ index: indexToScroll, behavior: 'smooth' });
        }
    };

    const getTopIndexAndVisibleCountOnScroll = () => {
        const virtualListInfo = getVirtualListInfo();
        if (!virtualListInfo.scrollContainer || !virtualListInfo.value) {
            return {
                visibleCount: virtualListInfo.value?.visibleCount,
                topIndex: virtualListInfo.value?.topIndex,
            };
        }

        return getRowsToFetchForScroll(virtualListInfo);
    };

    useLayoutEffectSafeForSsr(() => {
        const rowsInfo = getUpdatedRowsInfo(getVirtualListInfo());
        rowHeights.current = rowsInfo.rowHeights;
        rowOffsets.current = rowsInfo.rowOffsets;
        if (scrollContainer.current && value) onScroll?.(scrollContainer.current);
        if (!scrollContainer.current || !value) return;

        if (value?.scrollTo !== scrolledTo && value?.scrollTo?.index != null) {
            handleForceScrollToIndex(rowsInfo);
        } else {
            handleScrollOnRerender(rowsInfo);
        }
    });

    const handleForceScrollToIndex = (rowsInfo: RowsInfo) => {
        const assumedHeight = assumeHeightForScrollToIndex(value, rowsInfo.estimatedHeight, rowsInfo.averageRowHeight);
        const estimatedHeightToSet = rowsCount >= value.scrollTo.index
            ? rowsInfo.estimatedHeight
            : assumedHeight;

        setEstimatedHeight(estimatedHeightToSet);
        scrollToIndex(value.scrollTo);
    };

    const handleScrollOnRerender = (rowsInfo: RowsInfo) => {
        if (estimatedHeight !== rowsInfo.estimatedHeight) {
            setEstimatedHeight(rowsInfo.estimatedHeight);
        }
        getNewRowsOnScroll();
    };

    const getNewRowsOnScroll = React.useCallback(() => {
        const { topIndex, visibleCount } = getTopIndexAndVisibleCountOnScroll();
        if (topIndex !== value.topIndex || visibleCount > value.visibleCount) {
            onValueChange({ ...value, topIndex, visibleCount });
        }
    }, [
        onValueChange, blockSize, rowOffsets.current, rowsCount, value, onScroll, scrollContainer.current,
    ]);

    const scrollContainerToPosition = React.useCallback(
        (scrollTo: ScrollToConfig) => {
            const topCoordinate = getScrollToCoordinate(getVirtualListInfo(), scrollTo);
            if (topCoordinate === undefined) {
                return [true, true]; // already at the necessary position, scroll doesn't have to be performed.
            }

            if (isNaN(topCoordinate)) {
                return [false, false];
            }
            scrollContainer.current.scrollTo({ top: topCoordinate, behavior: scrollTo.behavior });
            const scrollPositionDiff = (+topCoordinate.toFixed(0)) - (+scrollContainer.current.scrollTop.toFixed(0));
            return [scrollPositionDiff === 0, true];
        },
        [scrollContainer.current, rowOffsets.current],
    );

    const scrollToIndex = React.useCallback(
        (scrollTo: ScrollToConfig) => {
            const [wasScrolled, ok] = scrollContainerToPosition(scrollTo);
            const topIndex = getTopIndexWithOffset(scrollTo.index, overdrawRows, blockSize);
            const shouldScrollToUnknownIndex = value.topIndex === topIndex && rowsCount <= value.scrollTo?.index;
            if ((ok && !wasScrolled) || value.topIndex !== topIndex) {
                let newScrollTo = value.scrollTo?.index === scrollTo.index ? value.scrollTo : { ...scrollTo, index: scrollTo.index };
                if (shouldScrollToUnknownIndex) {
                    newScrollTo = { ...scrollTo, index: rowsCount - 1 };
                }
                onValueChange({ ...value, topIndex, scrollTo: newScrollTo });
            }

            if ((ok && wasScrolled) || (shouldScrollToUnknownIndex)) {
                setScrolledTo(value.scrollTo?.index === scrollTo.index ? value.scrollTo : { ...scrollTo, index: scrollTo.index });
            }
        },
        [scrollContainer.current, rowOffsets.current, value?.topIndex, overdrawRows, blockSize],
    );

    useLayoutEffectSafeForSsr(() => {
        handleScrollToFocus();
    }, [value?.focusedIndex]);

    const offsetY = React.useMemo(
        () => getOffsetYForIndex(value?.topIndex, rowOffsets.current, listOffset),
        [rowOffsets.current, listOffset, value?.topIndex],
    );

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current && !value) return;
        onScroll?.(scrollContainer.current);

        if (value.scrollTo !== scrolledTo && value.scrollTo?.index != null) {
            return;
        }
        getNewRowsOnScroll();
    }, [value, onScroll, scrollContainer.current, getNewRowsOnScroll]);

    return {
        estimatedHeight,
        offsetY,
        listOffset,

        scrollContainerRef: scrollContainer,
        listContainerRef: listContainer,

        handleScroll,
        scrollToIndex,
    };
}
