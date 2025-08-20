import { VirtualListState } from '../../../types';
import { assumeHeightForScrollToIndex, getAverageRowHeight, getNewEstimatedContainerHeight, getOffsetYForIndex,
    getRowsToFetchForScroll, getTopCoordinate, getTopIndexWithOffset, getUpdatedRowHeights, getUpdatedRowOffsets,
    getUpdatedRowsInfo,
} from '../utils';
import { RowsInfo, VirtualListInfo } from '../types';
import { createListContainer, createScrollContainer } from './helpers';

const createRowsInfo = ({ rowOffsets = [], rowHeights = [] }: Partial<RowsInfo> = { rowOffsets: [], rowHeights: [] }) => ({ rowOffsets, rowHeights });

describe('getUpdatedRowHeights', () => {
    const creaateVirtualListInfo = (
        value: VirtualListState,
    ): VirtualListInfo => ({
        value,
        rowsCount: 100,
        blockSize: 20,
        overdrawRows: 20,
        listOffset: 10,
    });

    it('should update row heights, starting from topIndex', () => {
        const listContainer = createListContainer([5, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo({ topIndex: 2 });

        expect(getUpdatedRowHeights(virtualListInfo, listContainer, createRowsInfo().rowHeights))
            .toEqual([undefined, undefined, 5, 7, 10]);
    });

    it('should update existing row heights', () => {
        const listContainer = createListContainer([6, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(
            { topIndex: 2 },
        );
        const rowsInfo = createRowsInfo({ rowHeights: [5, 5, 5, 5, 5, 5, 5, 5] });
        expect(getUpdatedRowHeights(virtualListInfo, listContainer, rowsInfo.rowHeights)).toEqual([5, 5, 6, 7, 10, 5, 5, 5]);
    });

    it('should update row heigts from 0 if no topIndex was provided', () => {
        const listContainer = createListContainer([6, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo({});
        const rowsInfo = createRowsInfo({ rowHeights: [5, 5, 5, 5, 5, 5, 5, 5] });

        expect(getUpdatedRowHeights(virtualListInfo, listContainer, rowsInfo.rowHeights)).toEqual([6, 7, 10, 5, 5, 5, 5, 5]);
    });
});

describe('getAverageRowHeight', () => {
    it('should calculate average row height', () => {
        expect(getAverageRowHeight([1, 3, 5, 7])).toBe(4);
    });

    it('should ignore undefined values', () => {
        expect(getAverageRowHeight([1, 3, undefined, 5, undefined, 7])).toBe(4);
    });

    it('should return 1 for empty array', () => {
        expect(getAverageRowHeight([])).toBe(1);
    });

    it('should return 1 for array without not empty values', () => {
        expect(getAverageRowHeight([undefined, undefined])).toBe(1);
    });
});

describe('getUpdatedRowOffsets', () => {
    const scrollContainer = createScrollContainer();
    const listContainer = createListContainer([]);
    const defaultInfo = {
        scrollContainer,
        listContainer,
        value: {},
        rowsCount: 10,
        blockSize: 20,
        overdrawRows: 20,
        rowOffsets: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        listOffset: 50,
        estimatedHeight: undefined,
        averageRowHeight: 15,
    };

    it('should update row offsets', () => {
        const rowsInfo = createRowsInfo({ rowHeights: new Array(11).fill(20) });
        expect(getUpdatedRowOffsets(defaultInfo, rowsInfo)).toEqual([
            50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250,
        ]);
    });

    it('should use average height if row height is undefined or zero', () => {
        const rowsInfo = createRowsInfo({ rowHeights: new Array(11).fill(0) });

        expect(getUpdatedRowOffsets(defaultInfo, rowsInfo)).toEqual([
            50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200,
        ]);

        const rowsInfo2 = createRowsInfo({ rowHeights: [] });

        expect(getUpdatedRowOffsets(defaultInfo, rowsInfo2)).toEqual([
            50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200,
        ]);
    });

    it('should count proper offsets if rows have different height', () => {
        const info = {
            ...defaultInfo,
            rowsCount: 3,
            blockSize: undefined,
            overdrawRows: undefined,
            rowOffsets: [],
            listOffset: 38,
            averageRowHeight: 69,
        };

        const rowsInfo = createRowsInfo({ rowHeights: [37, 37, 133] });
        expect(getUpdatedRowOffsets(info, rowsInfo)).toEqual([
            38, 75, 112, 245,
        ]);
    });
});

describe('getNewEstimatedContainerHeight', () => {
    it('should return new estimated height', () => {
        expect(getNewEstimatedContainerHeight([5, 15, 40, 100, 110], 4, 5)).toEqual(105);
    });
});

describe('getUpdatedRowsInfo', () => {
    const scrollContainer = createScrollContainer();
    const listContainer = createListContainer([]);
    const defaultInfo = {
        value: {},
        rowsCount: 10,
        blockSize: 20,
        overdrawRows: 20,

        listOffset: 50,
        estimatedHeight: 20,
        averageRowHeight: 15,
    };

    const rowsInfo = createRowsInfo({ rowHeights: [1], rowOffsets: [16] });
    it('should return old values if scroll container is not defined', () => {
        expect(getUpdatedRowsInfo(defaultInfo, { scrollContainer: undefined, listContainer }, rowsInfo)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if list container is not defined', () => {
        expect(getUpdatedRowsInfo(defaultInfo, { scrollContainer, listContainer: undefined }, rowsInfo)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if list offset is not defined', () => {
        const info = {
            ...defaultInfo,
            listOffset: null,
        };

        expect(getUpdatedRowsInfo(info, { listContainer, scrollContainer }, rowsInfo)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });

        const info2 = {
            ...defaultInfo,
            listOffset: undefined,
        };

        expect(getUpdatedRowsInfo(info2, { listContainer, scrollContainer }, rowsInfo)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if value is not defined', () => {
        const info = {
            ...defaultInfo,
            value: undefined,
        };
        expect(getUpdatedRowsInfo(info, { listContainer, scrollContainer }, rowsInfo)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return updated values', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 1 },
        };
        const listContainer2 = createListContainer([10, 20, 20, 20, 15, 10, 15]);
        const rowsInfo2 = createRowsInfo({ ...rowsInfo, rowHeights: [1, 1, 1] });

        expect(getUpdatedRowsInfo(info, { listContainer: listContainer2, scrollContainer }, rowsInfo2)).toEqual({
            rowHeights: [1, 10, 20, 20, 20, 15, 10, 15],
            rowOffsets: [
                50,
                51,
                61,
                81,
                101,
                121,
                136,
                146,
                161,
                174.875,
                188.75,
            ],
            estimatedHeight: 138.75,
            averageRowHeight: 13.875,
        });
    });
});

describe('getRowsToFetchForScroll', () => {
    const defaultRowsInfo = createRowsInfo({ rowOffsets: [10, 30, 50, 70, 85, 95, 110, 500, 510, 560] });
    const defaultInfo = {
        value: { topIndex: 1 },
        rowsCount: 5,
        blockSize: 1,
        overdrawRows: 1,
        listOffset: 50,
        estimatedHeight: 20,
        averageRowHeight: 15,
    };

    it('should limit topIndex with rowsCount', () => {
        const scrollContainer = createScrollContainer({ scrollTop: 100, clientHeight: 1000 });

        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 10 },
            rowsCount: 10,
        };

        expect(getRowsToFetchForScroll(info, scrollContainer, defaultRowsInfo.rowOffsets)).toEqual({
            visibleCount: 5,
            topIndex: 5,
        });
    });

    it('should limit topIndex with scrollTop', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            rowsCount: 20,
        };

        const scrollContainer = createScrollContainer({ scrollTop: 200, clientHeight: 1000 });
        expect(getRowsToFetchForScroll(info, scrollContainer, defaultRowsInfo.rowOffsets)).toEqual({
            visibleCount: 5,
            topIndex: 6,
        });
    });

    it('should limit visibleCount with rowsCount', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            rowsCount: 5,
        };

        const scrollContainer = createScrollContainer({ scrollTop: 100, clientHeight: 1000 });

        expect(getRowsToFetchForScroll(info, scrollContainer, defaultRowsInfo.rowOffsets)).toEqual({
            visibleCount: 4,
            topIndex: 1,
        });
    });

    it('should limit visibleCount with clientHeight', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            rowsCount: 100,
            overdrawRows: 0,
        };
        const scrollContainer = createScrollContainer({ scrollTop: 100, clientHeight: 200 });

        expect(getRowsToFetchForScroll(info, scrollContainer, defaultRowsInfo.rowOffsets)).toEqual({
            visibleCount: 1,
            topIndex: 6,
        });
    });

    it('should overdraw rows', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            rowsCount: 100,
            overdrawRows: 5,
        };

        const scrollContainer = createScrollContainer({ scrollTop: 100, clientHeight: 200 });

        expect(getRowsToFetchForScroll(info, scrollContainer, defaultRowsInfo.rowOffsets)).toEqual({
            visibleCount: 11,
            topIndex: 1,
        });
    });

    it('should align to block size', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 10 },
            rowsCount: 5,
            blockSize: 2,
            overdrawRows: 0,
        };

        const scrollContainer = createScrollContainer({ scrollTop: 200, clientHeight: 200 });

        expect(getRowsToFetchForScroll(info, scrollContainer, defaultRowsInfo.rowOffsets)).toEqual({
            visibleCount: 2,
            topIndex: 4,
        });
    });
});

describe('getTopCoordinate', () => {
    const defaultInfo = {
        value: { topIndex: 1 },
        rowsCount: 5,
        blockSize: 2,
        overdrawRows: 0,
        listOffset: 50,
        estimatedHeight: 20,
        averageRowHeight: 15,
    };
    it('should get top coordinate for index to scroll by rowOffset', () => {
        const rowsInfo = createRowsInfo({
            rowHeights: [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            rowOffsets: [10, 40, 90, 160, 245, 355, 855, 1365, 1925],
        });
        expect(getTopCoordinate(defaultInfo, rowsInfo, { index: 3 })).toEqual(110);
    });

    it('should assume top coordinate for index to scroll by rowOffset', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 1, visibleCount: 9 },

        };
        const rowsInfo = createRowsInfo({
            rowHeights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            rowOffsets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
        });
        expect(getTopCoordinate(info, rowsInfo, { index: 100 })).toEqual(960);
    });
});

describe('assumeHeightForScrollToIndex', () => {
    it('should assume height for scroll to index', () => {
        expect(assumeHeightForScrollToIndex({ topIndex: 5, visibleCount: 10, scrollTo: { index: 100 } }, 100, 10))
            .toEqual(960);
    });

    it('should estimated height for scrollTo.index less than topIndex + visibleCount', () => {
        expect(assumeHeightForScrollToIndex({ topIndex: 5, visibleCount: 10, scrollTo: { index: 2 } }, 100, 10))
            .toEqual(100);
    });
});

describe('getTopIndexWithOffset', () => {
    it('should return topIndex with offset', () => {
        expect(getTopIndexWithOffset(99, 20, 20)).toEqual(60);
    });

    it('should return 0 if topIndex is less than overdrawRows', () => {
        expect(getTopIndexWithOffset(5, 20, 20)).toEqual(0);
    });

    it('should return 0 if topIndex is equal to overdrawRows', () => {
        expect(getTopIndexWithOffset(5, 5, 20)).toEqual(0);
    });
});

describe('getOffsetYForIndex', () => {
    it('should return 0 if rowOffsets is empty', () => {
        expect(getOffsetYForIndex(10, [], 10)).toEqual(0);
    });

    it('should return 0 if index is null or undefined', () => {
        expect(getOffsetYForIndex(null, [1, 2, 3], 10)).toEqual(0);
        expect(getOffsetYForIndex(undefined, [1, 2, 3], 10)).toEqual(0);
    });

    it('should return offsetY', () => {
        expect(getOffsetYForIndex(2, [10, 20, 30], 10)).toEqual(20);
    });
});
