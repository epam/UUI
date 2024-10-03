import type { ScrollToConfig, VirtualListState } from '../../types';
import { RowsInfo, VirtualListInfo } from './types';

export const getUpdatedRowHeights = (virtualListInfo: VirtualListInfo) => {
    const newRowHeights = [...virtualListInfo.rowHeights];
    const { listContainer, rowsSelector } = virtualListInfo;
    const rows = rowsSelector
        ? listContainer.querySelectorAll(rowsSelector)
        : listContainer.children;

    Array.from<Element>(rows).forEach((node, index) => {
        const topIndex = virtualListInfo.value.topIndex || 0;
        const { height } = node.getBoundingClientRect();
        if (!height) return;
        newRowHeights[topIndex + index] = height;
    });
    return newRowHeights;
};

export const getAverageRowHeight = (rowHeights: Array<number | undefined>) => {
    const notEmptyRowsHeights = rowHeights.filter((height) => height !== undefined);
    if (!notEmptyRowsHeights.length) {
        return 1;
    }
    const totalRowHeights = notEmptyRowsHeights.reduce((sum, next) => sum + next, 0);
    return totalRowHeights / notEmptyRowsHeights.length;
};

export const getUpdatedRowOffsets = (
    { rowOffsets, rowsCount, listOffset, rowHeights, averageRowHeight }: VirtualListInfo,
) => {
    const newRowOffsets = [...rowOffsets];
    for (let n = 0; n <= rowsCount; n++) {
        newRowOffsets[n] = n === 0
            ? listOffset
            : newRowOffsets[n - 1] + (rowHeights[n - 1] || averageRowHeight);
    }
    return newRowOffsets;
};

export const getNewEstimatedContainerHeight = (rowOffsets: number[], rowsCount: number, listOffset: number) =>
    rowOffsets[rowsCount] - listOffset;

export const getUpdatedRowsInfo = (
    virtualListInfo: VirtualListInfo,
): RowsInfo => {
    if (!virtualListInfo.scrollContainer
        || !virtualListInfo.listContainer
        || virtualListInfo.listOffset == null
        || !virtualListInfo.value
    ) {
        return {
            rowHeights: virtualListInfo.rowHeights,
            rowOffsets: virtualListInfo.rowOffsets,
            estimatedHeight: virtualListInfo.estimatedHeight,
        };
    }
    const rowHeights = getUpdatedRowHeights(virtualListInfo);
    const averageRowHeight = getAverageRowHeight(rowHeights);
    const rowOffsets = getUpdatedRowOffsets({ ...virtualListInfo, rowHeights, averageRowHeight });

    const estimatedHeight = getNewEstimatedContainerHeight(
        rowOffsets,
        virtualListInfo.rowsCount,
        virtualListInfo.listOffset,
    );

    return {
        estimatedHeight,
        rowHeights,
        rowOffsets,
        averageRowHeight,
    };
};

const getNewTopIndex = (info: VirtualListInfo) => {
    const { overdrawRows, blockSize, value } = info;
    let newTopIndex = getRealTopIndex(info);
    newTopIndex = newTopIndex - overdrawRows;
    newTopIndex = Math.max(0, newTopIndex);

    const topIndexDiff = Math.abs(value.topIndex - newTopIndex);
    // Number of rows to be scrolled up or down to trigger topIndex change.
    // This tolerance is required to avoid problems when scroll position is close to blocks boundaries, and even tiny difference
    // in row heights (e.g. 1px margin collapse) can cause endless loop of re-renderings
    const loadingThreshold = 5;
    if (topIndexDiff < loadingThreshold) {
        return value.topIndex;
    }

    return Math.floor(newTopIndex / blockSize) * blockSize; // Align to blockSize
};

const getNewBottomIndex = (info: VirtualListInfo) => {
    const { rowsCount, overdrawRows, blockSize } = info;

    let bottomIndex = getRealBottomIndex(info);
    bottomIndex = bottomIndex + overdrawRows; // draw more rows at the bottom to remove visible blank areas while scrolling down
    bottomIndex = Math.floor(bottomIndex / blockSize) * blockSize; // Align to block size
    return Math.min(bottomIndex, rowsCount ?? 0); // clamp to rowsCount
};

export const getRealTopIndex = ({ rowsCount, scrollContainer, rowOffsets }: VirtualListInfo) => {
    let realTopIndex = 0;
    const containerScrollTop = scrollContainer?.scrollTop ?? 0;
    while (realTopIndex < rowsCount && rowOffsets[realTopIndex] < containerScrollTop) {
        realTopIndex += 1;
    }
    return realTopIndex;
};

const getRealBottomIndex = ({ rowsCount, scrollContainer, rowOffsets, value: { topIndex } }: VirtualListInfo) => {
    let bottomIndex = topIndex;
    const containerScrollTop = scrollContainer?.scrollTop ?? 0;

    const containerScrollBottom = containerScrollTop + scrollContainer?.clientHeight ?? 0;
    while (bottomIndex < rowsCount && rowOffsets[bottomIndex] < containerScrollBottom) {
        bottomIndex++;
    }
    return bottomIndex;
};

export const getRowsToFetchForScroll = (virtualListInfo: VirtualListInfo) => {
    const topIndex = getNewTopIndex(virtualListInfo);
    const bottomIndex = getNewBottomIndex({ ...virtualListInfo, value: { ...virtualListInfo.value, topIndex } });

    const { value, blockSize } = virtualListInfo;
    // We never reduce visible count intentionally - it can be set so a larger value intentionally.
    // Also, reducing it can cause bouncing between two near values, causing unnecessary re-renders.
    const visibleCount = Math.max(value.visibleCount ?? blockSize, bottomIndex - topIndex);

    return { visibleCount, topIndex };
};

export const getScrollToCoordinate = (
    info: VirtualListInfo,
    scrollTo: ScrollToConfig,
) => {
    const topCoordinate = getTopCoordinate(info, scrollTo);
    const { index, align } = scrollTo;
    if (!align || align === 'top') {
        return topCoordinate;
    }

    const realTopIndex = getRealTopIndex(info);
    const realBottomIndex = getRealBottomIndex({
        ...info, value: { ...info.value, topIndex: realTopIndex },
    });

    if (index < realTopIndex) {
        return topCoordinate;
    }

    if (index >= realBottomIndex - 1) {
        return getTopCoordinate(info, { ...scrollTo, index: scrollTo.index + 1 }) - info.scrollContainer?.clientHeight;
    }

    return undefined;
};

export const getTopCoordinate = (
    { rowOffsets, listOffset, value, rowHeights }: VirtualListInfo,
    scrollTo: ScrollToConfig,
) => {
    let rowCoordinate = rowOffsets[scrollTo.index];
    if (rowCoordinate === undefined) {
        const { topIndex = 0, visibleCount = 0 } = value;
        const visibleRowsCount = topIndex + visibleCount;
        const assumedRowsCount = Math.max(scrollTo.index - visibleRowsCount, 0);
        const averageRowHeight = getAverageRowHeight(rowHeights);
        const assumedRowsHeight = assumedRowsCount * averageRowHeight;
        const heightOfExistingRows = rowOffsets[visibleRowsCount] ?? rowOffsets[rowOffsets.length - 1];
        rowCoordinate = heightOfExistingRows + assumedRowsHeight;
    }
    return rowCoordinate - listOffset;
};

export const assumeHeightForScrollToIndex = (value: VirtualListState, estimatedHeight: number, averageRowHeight: number) => {
    const { topIndex = 0, visibleCount = 0, scrollTo } = value;
    const scrollToIndex = scrollTo?.index ?? 0;
    const skipRowsCount = Math.max(0, scrollToIndex - (topIndex + visibleCount - 1));
    return estimatedHeight + skipRowsCount * averageRowHeight;
};

export const getTopIndexWithOffset = (index: number, overdrawRows: number, blockSize: number) => {
    let topIndex = index - overdrawRows; // draw more rows at the top to remove visible blank areas while scrolling up
    topIndex = Math.floor(topIndex / blockSize) * blockSize; // Align to blockSize
    return Math.max(0, topIndex);
};

export const getOffsetYForIndex = (index: number | null | undefined, rowOffsets: number[], listOffset: number) => {
    if (rowOffsets.length === 0 || index == null) return 0;
    const offsetY = rowOffsets[index] - listOffset;
    if (isNaN(offsetY)) {
        return 0;
    }
    return offsetY;
};
