import * as React from 'react';
import type { ScrollToConfig } from '../../types';
import { useLayoutEffectSafeForSsr } from '../../ssr/useLayoutEffectSafeForSsr';
import {
    getRowsToFetchForScroll, assumeHeightForScrollToIndex,
    getOffsetYForIndex, getScrollToCoordinate, getRealTopIndex, getTopIndexWithOffset,
    getAverageRowHeight,
    getUpdatedRowOffsets,
    getNewEstimatedContainerHeight,
} from './utils';
import { VirtualListInfo, UseVirtualListProps, UseVirtualListApi, RowsInfo } from './types';

const getUpdatedRowHeights = (vli: VirtualListInfo, visibleEntries: IntersectionObserverEntry[]) => {
    const rows = vli.rowsSelector
        ? vli.listContainer.querySelectorAll(vli.rowsSelector)
        : vli.listContainer.children;
    const rowsArr = Array.from(rows);
    const [firstNewVisibleElement] = visibleEntries;
    const firstElementIndex = rowsArr.indexOf(firstNewVisibleElement.target);
    const newRowHeights = [...vli.rowHeights];

    const realTopIndex = (vli.value.topIndex || 0) + firstElementIndex;
    visibleEntries.forEach((entry, index) => {
        const { height } = entry.boundingClientRect;
        if (!height) return;
        newRowHeights[realTopIndex + index] = height;
    });

    return newRowHeights;
};

const getUpdatedRowsInfo1 = (
    vli: VirtualListInfo,
    visibleEntries: IntersectionObserverEntry[],
): RowsInfo => {
    if (!vli.scrollContainer
        || !vli.listContainer
        || vli.listOffset == null
        || !vli.value
    ) {
        return {
            rowHeights: vli.rowHeights,
            rowOffsets: vli.rowOffsets,
            estimatedHeight: vli.estimatedHeight,
        };
    }
    const rowHeights = getUpdatedRowHeights(vli, visibleEntries);
    const averageRowHeight = getAverageRowHeight(rowHeights);
    const rowOffsets = getUpdatedRowOffsets({ ...vli, rowHeights, averageRowHeight });

    const estimatedHeight = getNewEstimatedContainerHeight(
        rowOffsets,
        vli.rowsCount,
        vli.listOffset,
    );

    return {
        estimatedHeight,
        rowHeights,
        rowOffsets,
        averageRowHeight,
    };
};

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
    const [visibleEntries, setVisibleEntries] = React.useState<IntersectionObserverEntry[]>([]);
    const listContainer = React.useRef<List>();
    const scrollContainer = React.useRef<ScrollContainer>();
    const rowHeights = React.useRef<number[]>([]);
    const rowOffsets = React.useRef<number[]>([]);
    const virtualListInfo = React.useMemo((): VirtualListInfo => ({
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
    }), [
        scrollContainer.current,
        listContainer.current,
        rowHeights.current,
        rowOffsets.current,
        value,
        rowsCount,
        blockSize,
        overdrawRows,
        listOffset,
        estimatedHeight,
        rowsSelector,
    ]);

    const offsetY = React.useMemo(
        () => getOffsetYForIndex(value?.topIndex, rowOffsets.current, listOffset),
        [rowOffsets.current, listOffset, value?.topIndex],
    );

    const obs = React.useMemo(() => new IntersectionObserver(
        (entries)=>{
            const vEntries = entries.filter((entry) => entry.isIntersecting);
            if (!vEntries.length) {
                return;
            }

            setVisibleEntries(vEntries);
        },
        { root: virtualListInfo.listContainer },
    ), []);

    React.useEffect(() => {
        if (!virtualListInfo.listContainer) return;
        const rows = rowsSelector
            ? virtualListInfo.listContainer.querySelectorAll(virtualListInfo.rowsSelector)
            : virtualListInfo.listContainer.children;

        const rowsArr = Array.from(rows);
        rowsArr.forEach((row) => {
            obs.observe(row);
        });
    }, [obs, virtualListInfo.listContainer, virtualListInfo.scrollContainer, value.topIndex, value.visibleCount]);

    React.useEffect(() => {
        return () => obs.disconnect();
    }, []);

    useLayoutEffectSafeForSsr(() => {
        const rowsInfo = getUpdatedRowsInfo1(virtualListInfo, visibleEntries);
        rowHeights.current = rowsInfo.rowHeights;
        rowOffsets.current = rowsInfo.rowOffsets;
        if (scrollContainer.current && value) onScroll?.(scrollContainer.current);
        if (!scrollContainer.current || !value) return;

        if (value?.scrollTo !== scrolledTo && value?.scrollTo?.index != null) {
            handleForceScrollToIndex(rowsInfo);
        } else {
            handleScrollOnRerender(rowsInfo);
        }
    }, [visibleEntries]);

    useLayoutEffectSafeForSsr(() => {
        if (!scrollContainer.current || !listContainer.current) return;
        const { top: scrollContainerTop } = scrollContainer.current.getBoundingClientRect();
        const { top: listContainerTop } = listContainer.current.getBoundingClientRect();
        const newListOffset = listContainerTop - scrollContainerTop;
        setListOffset(newListOffset);
    }, [scrollContainer.current, listContainer.current]);

    const getTopIndexAndVisibleCountOnScroll = React.useCallback(() => {
        if (!virtualListInfo.scrollContainer || !virtualListInfo.value) {
            return {
                visibleCount: virtualListInfo.value?.visibleCount,
                topIndex: virtualListInfo.value?.topIndex,
            };
        }

        return getRowsToFetchForScroll(virtualListInfo);
    }, [virtualListInfo]);

    // useLayoutEffectSafeForSsr(() => {
    //     const rowsInfo = getUpdatedRowsInfo(virtualListInfo);
    //     rowHeights.current = rowsInfo.rowHeights;
    //     rowOffsets.current = rowsInfo.rowOffsets;
    //     if (scrollContainer.current && value) onScroll?.(scrollContainer.current);
    //     if (!scrollContainer.current || !value) return;

    //     if (value?.scrollTo !== scrolledTo && value?.scrollTo?.index != null) {
    //         handleForceScrollToIndex(rowsInfo);
    //     } else {
    //         handleScrollOnRerender(rowsInfo);
    //     }
    // });

    const handleForceScrollToIndex = (rowsInfo: RowsInfo) => {
        const assumedHeight = assumeHeightForScrollToIndex(value, rowsInfo.estimatedHeight, rowsInfo.averageRowHeight);
        const estimatedHeightToSet = rowsCount >= value.scrollTo.index
            ? rowsInfo.estimatedHeight
            : assumedHeight;
        setEstimatedHeight(estimatedHeightToSet);
        scrollToIndex(value.scrollTo);
    };

    const handleScrollOnRerender = (rowsInfo: RowsInfo) => {
        const { topIndex } = value;
        const { topIndex: newTopIndex, visibleCount } = getNewRowsOnScroll();

        if (estimatedHeight !== rowsInfo.estimatedHeight) {
            setEstimatedHeight(rowsInfo.estimatedHeight);
        }
        if (topIndex !== newTopIndex || visibleCount !== value.visibleCount) {
            onValueChange({ ...value, topIndex: newTopIndex, visibleCount });
        }
    };

    const getNewRowsOnScroll = React.useCallback(() => {
        const { topIndex, visibleCount } = getTopIndexAndVisibleCountOnScroll();
        if (topIndex !== value.topIndex || visibleCount > value.visibleCount) {
            return { topIndex, visibleCount };
        }

        return value;
    }, [getTopIndexAndVisibleCountOnScroll, onValueChange, value]);

    const scrollContainerToPosition = React.useCallback(
        (scrollTo: ScrollToConfig) => {
            const topCoordinate = getScrollToCoordinate(virtualListInfo, scrollTo);
            if (topCoordinate === undefined) {
                return [true, true]; // already at the necessary position, scroll doesn't have to be performed.
            }

            if (isNaN(topCoordinate)) {
                return [false, false];
            }

            scrollContainer.current.scrollTo({ top: topCoordinate, behavior: scrollTo.behavior });
            const scrollPositionDiff = (+topCoordinate.toFixed(0)) - (+scrollContainer.current.scrollTop.toFixed(0));

            return [
                scrollPositionDiff <= 1 // if scroll position is equal to expected one
                && virtualListInfo.rowHeights[scrollTo.index] !== undefined, // and required row with necessary index is present
                true,
            ];
        },
        [scrollContainer.current, rowOffsets.current, virtualListInfo],
    );

    const scrollToIndex = React.useCallback(
        (scrollTo: ScrollToConfig) => {
            const topIndex = getTopIndexWithOffset(scrollTo.index, overdrawRows, blockSize);
            const { visibleCount } = getTopIndexAndVisibleCountOnScroll();

            const [wasScrolled, ok] = scrollContainerToPosition(scrollTo);
            if ((ok && !wasScrolled) || value.topIndex !== topIndex || value.visibleCount !== visibleCount) {
                onValueChange({ ...value, topIndex, visibleCount, scrollTo });
            }

            const realTopIndex = getRealTopIndex(virtualListInfo);
            // prevents from cycling, while force scrolling to a row, which will never appear, when using LazyListView.
            const shouldScrollToUnknownIndex = value.topIndex === topIndex && value.scrollTo?.index > realTopIndex;
            if ((ok && wasScrolled) || shouldScrollToUnknownIndex) {
                if (value.scrollTo?.index === scrollTo.index) {
                    setScrolledTo(value.scrollTo);
                } else {
                    onValueChange({ ...value, scrollTo });
                    setScrolledTo(scrollTo);
                }
            }
        },
        [
            scrollContainer.current,
            rowOffsets.current,
            value?.topIndex,
            value?.scrollTo,
            overdrawRows,
            blockSize,
            scrollContainerToPosition,
            virtualListInfo,
        ],
    );

    const handleScroll = React.useCallback(() => {
        if (!scrollContainer.current && !value) return;
        onScroll?.(scrollContainer.current);

        if (value.scrollTo !== scrolledTo && value.scrollTo?.index != null) {
            return;
        }
        const newValue = getNewRowsOnScroll();
        if (value.topIndex !== newValue.topIndex || value.visibleCount !== newValue.visibleCount) {
            onValueChange({ ...value, ...newValue });
        }
    }, [value, onScroll, scrolledTo, scrollContainer.current, getNewRowsOnScroll]);

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
