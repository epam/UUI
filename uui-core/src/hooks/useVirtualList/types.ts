import type { IEditable, ScrollToConfig, VirtualListState } from '../../types';

export interface UseVirtualListApi<List, ScrollContainer> {
    offsetY: number;
    listOffset: number;
    estimatedHeight: number;
    handleScroll: React.DOMAttributes<ScrollContainer>['onScroll'];
    listContainerRef: React.MutableRefObject<List>;
    scrollContainerRef: React.MutableRefObject<ScrollContainer>;
    scrollToIndex(config: ScrollToConfig): void;
}

export interface UseVirtualListProps extends IEditable<VirtualListState> {
    /** Count of list items */
    rowsCount?: number | undefined;

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

    /** Called when list was scrolled */
    onScroll?(value: HTMLElement): void;

    /**
     * Selector to get rows container node.
     */
    rowsSelector?: string;
}

export interface RowsListInfo extends RowsInfo {
    estimatedHeight?: number;
    averageRowHeight?: number;
}

export interface VirtualListInfo {
    value: VirtualListState | undefined;
    rowsCount: number | undefined;
    blockSize: number;
    overdrawRows: number;
    listOffset: number | undefined | null;
    estimatedHeight?: number;
    averageRowHeight?: number;
    rowsSelector?: string;
}

export interface Containers {
    scrollContainer: HTMLElement | undefined;
    listContainer: HTMLElement | undefined;
}

export interface RowsInfo {
    rowHeights: number[];
    rowOffsets: number[];
}
