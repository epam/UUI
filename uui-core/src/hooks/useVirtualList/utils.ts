import type { VirtualListState } from '../../types';
import { VirtualListInfo } from './VirtualListInfo';
import { RowsInfo } from './types';

export const getUpdatedRowHeights = (virtualListInfo: VirtualListInfo) => {
    const newRowHeights = [...virtualListInfo.rowHeights];
    Array.from<Element>(virtualListInfo.listContainer.querySelectorAll('[role=row]')).forEach((node, index) => {
        const topIndex = virtualListInfo.value.topIndex || 0;
        const { height } = node.getBoundingClientRect();
        if (!height) return;
        newRowHeights[topIndex + index] = height;
    });
    return newRowHeights;
};

export const getAverageRowHeight = (rowHeights: number[]) => {
    if (!rowHeights.length) {
        return 1;
    }
    const notEmptyRowsHeights = rowHeights.filter((height) => height !== undefined);
    const totalRowHeights = notEmptyRowsHeights.reduce((sum, next) => sum + next, 0);
    return totalRowHeights / notEmptyRowsHeights.length;
};

export const getUpdatedRowOffsets = (
    { rowOffsets, rowsCount, listOffset }: VirtualListInfo,
    newRowHeights: number[],
    newAverageRowHeight: number,
) => {
    const newRowOffsets = [...rowOffsets];
    for (let n = 0; n <= rowsCount; n++) {
        newRowOffsets[n] = n === 0
            ? listOffset
            : newRowOffsets[n - 1] + (newRowHeights[n] || newAverageRowHeight);
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
    const rowOffsets = getUpdatedRowOffsets(virtualListInfo, rowHeights, averageRowHeight);

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

const getNewTopIndex = ({ rowsCount, containerScrollTop, rowOffsets, overdrawRows, blockSize }: VirtualListInfo) => {
    let newTopIndex = 0;
    while (newTopIndex < rowsCount && rowOffsets[newTopIndex] < containerScrollTop) {
        newTopIndex += 1;
    }

    newTopIndex = newTopIndex - overdrawRows; // draw more rows at the top to remove visible blank areas while scrolling up
    newTopIndex = Math.floor(newTopIndex / blockSize) * blockSize; // Align to blockSize
    return Math.max(0, newTopIndex);
};

const getNewBottomIndex = (
    { rowsCount, containerScrollBottom, rowOffsets, overdrawRows, blockSize }: VirtualListInfo,
    newTopIndex: number,
) => {
    let bottomIndex = newTopIndex;
    while (bottomIndex < rowsCount && rowOffsets[bottomIndex] < containerScrollBottom) {
        bottomIndex++;
    }

    bottomIndex = bottomIndex + overdrawRows; // draw more rows at the bottom to remove visible blank areas while scrolling down
    bottomIndex = Math.floor(bottomIndex / blockSize) * blockSize; // Align to block size
    return Math.min(bottomIndex, rowsCount); // clamp to rowsCount
};

export const getRowsToFetchForScroll = (virtualListInfo: VirtualListInfo) => {
    const topIndex = getNewTopIndex(virtualListInfo);
    const bottomIndex = getNewBottomIndex(virtualListInfo, topIndex);

    const { value, blockSize } = virtualListInfo;
    // We never reduce visible count intentionally - it can be set so a larger value intentionally.
    // Also, reducing it can cause bouncing between two near values, causing unnecessary re-renders.
    const visibleCount = Math.max(value.visibleCount ?? blockSize, bottomIndex - topIndex);

    return { visibleCount, topIndex };
};

export const getTopCoordinate = (
    { rowOffsets, listOffset, value, rowHeights }: VirtualListInfo,
    indexToScroll: number,
) => {
    let rowCoordinate = rowOffsets[indexToScroll];
    if (rowCoordinate === undefined) {
        const { topIndex = 0, visibleCount = 0 } = value;
        const assumedRowsCount = indexToScroll - topIndex - visibleCount;
        const averageRowHeight = getAverageRowHeight(rowHeights);
        const assumedRowsHeight = assumedRowsCount * averageRowHeight;
        const heightOfExistingRows = rowOffsets[topIndex + visibleCount] ?? 0;
        rowCoordinate = heightOfExistingRows + assumedRowsHeight;
    }
    return rowCoordinate - listOffset;
};

export const assumeHeightForScrollToIndex = (value: VirtualListState, estimatedHeight: number, averageRowHeight: number) => {
    const { topIndex = 0, visibleCount = 0 } = value;
    return estimatedHeight
            + (value.scrollTo.index - topIndex - visibleCount)
            * averageRowHeight;
};

export const getTopIndexWithOffset = (index: number, overdrawRows: number, blockSize: number) => {
    let topIndex = index - overdrawRows; // draw more rows at the top to remove visible blank areas while scrolling up
    topIndex = Math.floor(topIndex / blockSize) * blockSize; // Align to blockSize
    return Math.max(0, topIndex);
};

export const getOffsetYForIndex = (index: number, rowOffsets: number[], listOffset: number) => {
    if (rowOffsets.length === 0 || index == null) return 0;
    return rowOffsets[index] - listOffset;
};
