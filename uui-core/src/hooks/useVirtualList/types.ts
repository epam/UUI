import type { IEditable, VirtualListState } from '../../types';

export interface UuiScrollPositionValues {
    scrollTop: number;
    clientHeight: number;
}

export interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    listOffset: number;
    estimatedHeight: number;
    handleScroll: React.DOMAttributes<ScrollContainer>['onScroll'];
    listContainerRef: React.MutableRefObject<List>;
    scrollContainerRef: React.MutableRefObject<ScrollContainer>;
    scrollToIndex(index: number, behavior: ScrollBehavior): void;
}

export interface UseVirtualListProps extends IEditable<VirtualListState> {
    rowsCount: number;

    /**
     * Virtual list will align topIndex and visibleCount to the block size.
     * E.g. with block size = 10, even if we have rows 2 to 12 visible, the range will be aligned to 0-20
     * This is done to not re-render rows on each scroll.
     * When scrolling, re-render will happen only when we scroll over the next blockSize rows.
     * Default is 20.
     */
    blockSize?: number;

    /**
     * Number of rows to draw before the top and after the bottom of the list.
     * This is required to hide blank areas while scrolling.
     * Default is 20.
     */
    overdrawRows?: number;

    onScroll?(value: Partial<UuiScrollPositionValues>): void;

    /**
     * Selector of `VirtualList` rows.
     * @default '[role=row]'
     */
    rowsSelector?: string;
}

export interface RowsInfo {
    estimatedHeight?: number;
    rowHeights: number[];
    rowOffsets: number[];
    averageRowHeight?: number;
}

export interface VirtualListInfo {
    scrollContainer: HTMLElement | undefined;
    listContainer: HTMLElement | undefined;
    value: VirtualListState | undefined;
    rowsCount: number;
    blockSize: number;
    overdrawRows: number;
    rowHeights: number[];
    rowOffsets: number[];
    listOffset: number | undefined | null;
    estimatedHeight?: number;
    averageRowHeight?: number;

    /**
     * Selector of `VirtualList` rows.
     * @default '[role=row]'
     */
    rowsSelector: string;
}
