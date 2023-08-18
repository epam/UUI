import * as React from 'react';
import type { ScrollToConfig } from '../../types';
import { useLayoutEffectSafeForSsr } from '../../ssr';
import {
    getRowsToFetchForScroll, getUpdatedRowsInfo, getTopCoordinate, assumeHeightForScrollToIndex,
    getTopIndexWithOffset, getOffsetYForIndex,
} from './utils';
import { UseVirtualListProps, UseVirtualListApi, RowsInfo } from './types';
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

        const [wasScrolled, ok] = scrollToIndex(value.scrollTo?.index);

        const topIndex = getTopIndexWithOffset(value.scrollTo.index, overdrawRows, blockSize);
        if ((ok && !wasScrolled) || value.topIndex !== topIndex) {
            onValueChange({ ...value, topIndex });
        }
        if (ok && wasScrolled) {
            setScrolledTo(value.scrollTo);
        }
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

    const scrollToIndex = React.useCallback(
        (index: number, behavior?: ScrollBehavior) => {
            const topCoordinate = getTopCoordinate(getVirtualListInfo(), index);
            if (!isNaN(topCoordinate)) {
                scrollContainer.current.scrollTo({ top: topCoordinate, behavior });
                return [scrollToOffsetY === topCoordinate, true];
            }
            return [false, false];
        },
        [scrollContainer.current, rowOffsets.current],
    );

    useLayoutEffectSafeForSsr(() => {
        handleScrollToFocus();
    }, [value?.focusedIndex]);

    const scrollToOffsetY = React.useMemo(
        () => getOffsetYForIndex(value?.scrollTo?.index, rowOffsets.current, listOffset),
        [rowOffsets.current, listOffset, value?.scrollTo?.index],
    );

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
        scrollContainerRef: scrollContainer,
        listContainerRef: listContainer,
        handleScroll,
        scrollToIndex,
        listOffset,
    };
}
