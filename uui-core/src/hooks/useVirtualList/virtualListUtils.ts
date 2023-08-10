import { VirtualListInfo } from './VirtualListInfo';

export const getUpdatedRowHeights = (virtualListInfo: VirtualListInfo) => {
    const newRowHeights = [...virtualListInfo.rowHeights];
    Array.from<Element>(virtualListInfo.listContainer.children).forEach((node, index) => {
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

    const totalRowHeights = rowHeights.reduce((sum, next) => sum + next, 0);
    return totalRowHeights / rowHeights.length;
};

export const getUpdatedRowOffsets = (
    { rowOffsets, rowsCount, listOffset, rowHeights, averageHeight }: VirtualListInfo,
) => {
    const newRowOffsets = [...rowOffsets];
    for (let n = 0; n <= rowsCount; n++) {
        newRowOffsets[n] = n === 0
            ? listOffset
            : newRowOffsets[n - 1] + (rowHeights[n] || averageHeight);
    }
    return newRowOffsets;
};

export const getNewEstimatedContainerHeight = (
    { rowOffsets, rowsCount, listOffset }: VirtualListInfo,
) => rowOffsets[rowsCount] - listOffset;

export const getUpdatedRowsInfo = (
    virtualListInfo: VirtualListInfo,
) => {
    if (!virtualListInfo.scrollContainer || !virtualListInfo.listContainer || virtualListInfo.listOffset == null || !virtualListInfo.value) {
        return {
            rowHeights: virtualListInfo.rowHeights,
            rowOffsets: virtualListInfo.rowOffsets,
            estimatedHeight: virtualListInfo.estimatedHeight,
        };
    }
    const rowHeights = getUpdatedRowHeights(virtualListInfo);
    const averageHeight = getAverageRowHeight(rowHeights);
    const newVirtualListInfo = virtualListInfo.update({ rowHeights, averageHeight });
    const rowOffsets = getUpdatedRowOffsets(newVirtualListInfo);
    const updatedVirtualListInfo = virtualListInfo.update({ rowOffsets });

    const estimatedContainerHeight = getNewEstimatedContainerHeight(updatedVirtualListInfo);
    return {
        estimatedContainerHeight,
        rowHeights,
        rowOffsets,
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
    { rowsCount, value: { topIndex }, containerScrollBottom, rowOffsets, overdrawRows, blockSize }: VirtualListInfo,
) => {
    let bottomIndex = topIndex;
    while (bottomIndex < rowsCount && rowOffsets[bottomIndex] < containerScrollBottom) {
        bottomIndex++;
    }

    bottomIndex = bottomIndex + overdrawRows; // draw more rows at the bottom to remove visible blank areas while scrolling down
    bottomIndex = Math.floor(bottomIndex / blockSize) * blockSize; // Align to block size
    return Math.min(bottomIndex, rowsCount); // clamp to rowsCount
};

export const getRowsToFetchForScroll = (virtualListInfo: VirtualListInfo) => {
    const { value, blockSize } = virtualListInfo;
    const topIndex = getNewTopIndex(virtualListInfo);
    const newVirtualListInfo = virtualListInfo.update({ value: { ...value, topIndex } });
    const bottomIndex = getNewBottomIndex(newVirtualListInfo);
    // We never reduce visible count intentionally - it can be set so a larger value intentionally.
    // Also, reducing it can cause bouncing between two near values, causing unnecessary re-renders.
    const visibleCount = Math.max(value.visibleCount ?? blockSize, bottomIndex - topIndex);

    return { visibleCount, topIndex };
};
