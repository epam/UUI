import type { ScrollToConfig, VirtualListState } from '../../types';
import { Containers, RowsInfo, RowsListInfo, VirtualListInfo } from './types';

export const getUpdatedRowHeights = (
    { rowsSelector, value }: Pick<VirtualListInfo, 'rowsSelector' | 'value'>,
    listContainer: Containers['listContainer'],
    rowHeights: RowsInfo['rowHeights'],
) => {
    const newRowHeights = [...rowHeights];
    const rows = rowsSelector
        ? listContainer.querySelectorAll(rowsSelector)
        : listContainer.children;

    Array.from<Element>(rows).forEach((node, index) => {
        const topIndex = value.topIndex || 0;
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
    {
        rowsCount,
        listOffset,
        averageRowHeight,
    }: Pick<VirtualListInfo, 'rowsCount' | 'listOffset' | 'averageRowHeight'>,
    { rowOffsets, rowHeights }: RowsInfo,
) => {
    const newRowOffsets = [...rowOffsets];
    for (let n = 0; n <= rowsCount; n++) {
        newRowOffsets[n] = n === 0
            ? listOffset
            : newRowOffsets[n - 1]
                  + (rowHeights[n - 1] || averageRowHeight);
    }
    return newRowOffsets;
};

export const getNewEstimatedContainerHeight = (
    rowOffsets: number[],
    rowsCount: number,
    listOffset: number,
) => rowOffsets[rowsCount] - listOffset;

export const getUpdatedRowsInfo = (
    {
        listOffset,
        value,
        estimatedHeight,
        rowsCount,
        rowsSelector,
    }: VirtualListInfo,
    { listContainer, scrollContainer }: Containers,
    rowsInfo: RowsInfo,
): RowsListInfo => {
    if (!scrollContainer || !listContainer || listOffset == null || !value) {
        return {
            rowHeights: rowsInfo.rowHeights,
            rowOffsets: rowsInfo.rowOffsets,
            estimatedHeight,
        };
    }

    const rowHeights = getUpdatedRowHeights({ rowsSelector, value }, listContainer, rowsInfo.rowHeights);

    const averageRowHeight = getAverageRowHeight(rowHeights);
    const rowOffsets = getUpdatedRowOffsets(
        {
            averageRowHeight,
            rowsCount,
            listOffset,
        },
        { rowOffsets: rowsInfo.rowOffsets, rowHeights },
    );

    const newEstimatedHeight = getNewEstimatedContainerHeight(rowOffsets, rowsCount, listOffset);

    return {
        estimatedHeight: newEstimatedHeight,
        rowHeights,
        rowOffsets,
        averageRowHeight,
    };
};

const getNewTopIndex = (
    {
        overdrawRows,
        blockSize,
        value,
        rowsCount,
    }: Pick<VirtualListInfo, 'overdrawRows' | 'blockSize' | 'value' | 'rowsCount'>,
    scrollContainer: Containers['scrollContainer'],
    rowOffsets: RowsInfo['rowOffsets'],
) => {
    let newTopIndex = getRealTopIndex(rowsCount, scrollContainer, rowOffsets);
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

const getNewBottomIndex = (
    {
        overdrawRows,
        blockSize,
        value,
        rowsCount,
    }: Pick<VirtualListInfo, 'overdrawRows' | 'blockSize' | 'value' | 'rowsCount'>,
    scrollContainer: Containers['scrollContainer'],
    rowOffsets: RowsInfo['rowOffsets'],
) => {
    let bottomIndex = getRealBottomIndex({ rowsCount, value }, scrollContainer, rowOffsets);
    bottomIndex = bottomIndex + overdrawRows; // draw more rows at the bottom to remove visible blank areas while scrolling down
    bottomIndex = Math.floor(bottomIndex / blockSize) * blockSize; // Align to block size
    return Math.min(bottomIndex, rowsCount ?? 0); // clamp to rowsCount
};

export const getRealTopIndex = (
    rowsCount: VirtualListInfo['rowsCount'],
    scrollContainer: Containers['scrollContainer'],
    rowOffsets: RowsInfo['rowOffsets'],
) => {
    let realTopIndex = 0;
    const containerScrollTop = scrollContainer?.scrollTop ?? 0;
    while (realTopIndex < rowsCount && rowOffsets[realTopIndex] < containerScrollTop) {
        realTopIndex += 1;
    }
    return realTopIndex;
};

const getRealBottomIndex = (
    {
        rowsCount,
        value: { topIndex },
    }: Pick<VirtualListInfo, 'rowsCount' | 'value'>,
    scrollContainer: Containers['scrollContainer'],
    rowOffsets: RowsInfo['rowOffsets'],
) => {
    let bottomIndex = topIndex;
    const containerScrollTop = scrollContainer?.scrollTop ?? 0;

    const containerScrollBottom = containerScrollTop + (scrollContainer?.clientHeight ?? 0);
    while (bottomIndex < rowsCount && rowOffsets[bottomIndex] < containerScrollBottom) {
        bottomIndex++;
    }
    return bottomIndex;
};

export const getRowsToFetchForScroll = (
    virtualListInfo: Pick<VirtualListInfo, 'overdrawRows' | 'blockSize' | 'value' | 'rowsCount'>,
    scrollContainer: Containers['scrollContainer'],
    rowOffsets: RowsInfo['rowOffsets'],
) => {
    const topIndex = getNewTopIndex(virtualListInfo, scrollContainer, rowOffsets);
    const bottomIndex = getNewBottomIndex(
        { ...virtualListInfo, value: { ...virtualListInfo.value, topIndex } },
        scrollContainer,
        rowOffsets,
    );

    const { value, blockSize } = virtualListInfo;
    // We never reduce visible count intentionally - it can be set so a larger value intentionally.
    // Also, reducing it can cause bouncing between two near values, causing unnecessary re-renders.
    const visibleCount = Math.max(
        value.visibleCount ?? blockSize,
        bottomIndex - topIndex,
    );

    return { visibleCount, topIndex };
};

export const getScrollToCoordinate = (
    virtualListInfo: Pick<VirtualListInfo, 'listOffset' | 'overdrawRows' | 'blockSize' | 'value' | 'rowsCount'>,
    scrollContainer: Containers['scrollContainer'],
    rowsListInfo: RowsInfo,
    scrollTo: ScrollToConfig,
) => {
    const topCoordinate = getTopCoordinate(virtualListInfo, rowsListInfo, scrollTo);
    const { index, align } = scrollTo;
    if (!align || align === 'top') {
        return topCoordinate;
    }

    const realTopIndex = getRealTopIndex(virtualListInfo.rowsCount, scrollContainer, rowsListInfo.rowOffsets);
    const realBottomIndex = getRealBottomIndex(
        { ...virtualListInfo, value: { ...virtualListInfo.value, topIndex: realTopIndex } },
        scrollContainer,
        rowsListInfo.rowOffsets,
    );

    if (index < realTopIndex) {
        return topCoordinate;
    }

    if (index >= realBottomIndex - 1) {
        const newTopCoordinate = getTopCoordinate(virtualListInfo, rowsListInfo, { ...scrollTo, index: scrollTo.index + 1 });

        return Math.max(newTopCoordinate - scrollContainer?.clientHeight, 0);
    }

    return undefined;
};

export const getTopCoordinate = (
    { listOffset, value }: Pick<VirtualListInfo, 'listOffset' | 'value'>,
    { rowOffsets, rowHeights }: RowsInfo,
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

export const assumeHeightForScrollToIndex = (
    value: VirtualListState,
    estimatedHeight: number,
    averageRowHeight: number,
) => {
    const { topIndex = 0, visibleCount = 0, scrollTo } = value;
    const scrollToIndex = scrollTo?.index ?? 0;
    const skipRowsCount = Math.max(0, scrollToIndex - (topIndex + visibleCount - 1));
    return estimatedHeight + skipRowsCount * averageRowHeight;
};

export const getTopIndexWithOffset = (
    index: number,
    overdrawRows: number,
    blockSize: number,
) => {
    let topIndex = index - overdrawRows; // draw more rows at the top to remove visible blank areas while scrolling up
    topIndex = Math.floor(topIndex / blockSize) * blockSize; // Align to blockSize
    return Math.max(0, topIndex);
};

export const getOffsetYForIndex = (
    index: number | null | undefined,
    rowOffsets: number[],
    listOffset: number,
) => {
    if (rowOffsets.length === 0 || index == null) return 0;
    const offsetY = rowOffsets[index] - listOffset;
    if (isNaN(offsetY)) {
        return 0;
    }
    return offsetY;
};
