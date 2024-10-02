import { VirtualListState } from '../../../types';
import { assumeHeightForScrollToIndex, getAverageRowHeight, getNewEstimatedContainerHeight, getOffsetYForIndex,
    getRowsToFetchForScroll, getTopCoordinate, getTopIndexWithOffset, getUpdatedRowHeights, getUpdatedRowOffsets,
    getUpdatedRowsInfo,
} from '../utils';
import { VirtualListInfo } from '../types';
import { createListContainer, createScrollContainer } from './helpers';

describe('getUpdatedRowHeights', () => {
    const scrollContainer = createScrollContainer();
    const creaateVirtualListInfo = (
        listContainer: HTMLDivElement,
        value: VirtualListState,
        rowHeights: number[],
    ): VirtualListInfo => ({
        scrollContainer,
        listContainer,
        value,
        rowsCount: 100,
        blockSize: 20,
        overdrawRows: 20,
        rowHeights,
        rowOffsets: [],
        listOffset: 10,
    });

    it('should update row heights, starting from topIndex', () => {
        const listContainer = createListContainer([5, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(listContainer, { topIndex: 2 }, []);
        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([undefined, undefined, 5, 7, 10]);
    });

    it('should update existing row heights', () => {
        const listContainer = createListContainer([6, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(
            listContainer,
            { topIndex: 2 },
            [5, 5, 5, 5, 5, 5, 5, 5],
        );

        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([5, 5, 6, 7, 10, 5, 5, 5]);
    });

    it('should update row heigts from 0 if no topIndex was provided', () => {
        const listContainer = createListContainer([6, 7, 10]);
        const virtualListInfo = creaateVirtualListInfo(
            listContainer,
            {},
            [5, 5, 5, 5, 5, 5, 5, 5],
        );

        expect(getUpdatedRowHeights(virtualListInfo)).toEqual([6, 7, 10, 5, 5, 5, 5, 5]);
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
        const info = { ...defaultInfo, rowHeights: new Array(11).fill(20) };
        expect(getUpdatedRowOffsets(info)).toEqual([
            50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250,
        ]);
    });

    it('should use average height if row height is undefined or zero', () => {
        const info = { ...defaultInfo, rowHeights: new Array(11).fill(0) };

        expect(getUpdatedRowOffsets(info)).toEqual([
            50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200,
        ]);

        const info2 = { ...defaultInfo, rowHeights: [] };
        expect(getUpdatedRowOffsets(info2)).toEqual([
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
            rowHeights: [37, 37, 133],
        };
        expect(getUpdatedRowOffsets(info)).toEqual([
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
    const defaultInfo = {
        scrollContainer: createScrollContainer(),
        listContainer: createListContainer([]),
        value: {},
        rowsCount: 10,
        blockSize: 20,
        overdrawRows: 20,
        rowHeights: [1],
        rowOffsets: [16],
        listOffset: 50,
        estimatedHeight: 20,
        averageRowHeight: 15,
    };
    it('should return old values if scroll container is not defined', () => {
        const info = {
            ...defaultInfo,
            scrollContainer: undefined,
        };
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if list container is not defined', () => {
        const info = {
            ...defaultInfo,
            listContainer: undefined,
        };
        expect(getUpdatedRowsInfo(info)).toEqual({
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

        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });

        const info2 = {
            ...defaultInfo,
            listOffset: undefined,
        };

        expect(getUpdatedRowsInfo(info2)).toEqual({
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
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return updated values', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            value: { topIndex: 1 },
            rowHeights: [1, 1, 1],
        };

        expect(getUpdatedRowsInfo(info)).toEqual({
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
    const defaultInfo = {
        scrollContainer: createScrollContainer(),
        listContainer: createListContainer([]),
        value: { topIndex: 1 },
        rowsCount: 5,
        blockSize: 1,
        overdrawRows: 1,
        rowHeights: [],
        rowOffsets: [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
        listOffset: 50,
        estimatedHeight: 20,
        averageRowHeight: 15,
    };

    it('should limit topIndex with rowsCount', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 10 },
            scrollContainer: createScrollContainer({ scrollTop: 100, clientHeight: 1000 }),
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            rowsCount: 10,
        };

        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 5,
            topIndex: 5,
        });
    });

    it('should limit topIndex with scrollTop', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            scrollContainer: createScrollContainer({ scrollTop: 200, clientHeight: 1000 }),
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            rowsCount: 20,
        };

        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 5,
            topIndex: 6,
        });
    });

    it('should limit visibleCount with rowsCount', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            scrollContainer: createScrollContainer({ scrollTop: 100, clientHeight: 1000 }),
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            rowsCount: 5,
        };

        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 4,
            topIndex: 1,
        });
    });

    it('should limit visibleCount with clientHeight', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            scrollContainer: createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            rowsCount: 100,
            overdrawRows: 0,
        };

        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 1,
            topIndex: 6,
        });
    });

    it('should overdraw rows', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            scrollContainer: createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            rowsCount: 100,
            overdrawRows: 5,
        };

        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 11,
            topIndex: 1,
        });
    });

    it('should align to block size', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 10 },
            scrollContainer: createScrollContainer({ scrollTop: 200, clientHeight: 200 }),
            listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
            rowsCount: 5,
            blockSize: 2,
            overdrawRows: 0,
        };

        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 2,
            topIndex: 4,
        });
    });
});

describe('getTopCoordinate', () => {
    const defaultInfo = {
        scrollContainer: createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
        listContainer: createListContainer([10, 20, 20, 20, 15, 10, 15]),
        value: { topIndex: 1 },
        rowsCount: 5,
        blockSize: 2,
        overdrawRows: 0,
        rowHeights: [],
        rowOffsets: [],
        listOffset: 50,
        estimatedHeight: 20,
        averageRowHeight: 15,
    };
    it('should get top coordinate for index to scroll by rowOffset', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            rowHeights: [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            rowOffsets: [10, 40, 90, 160, 245, 355, 855, 1365, 1925],
        };

        expect(getTopCoordinate(info, { index: 3 })).toEqual(110);
    });

    it('should assume top coordinate for index to scroll by rowOffset', () => {
        const info: VirtualListInfo = {
            ...defaultInfo,
            value: { topIndex: 1, visibleCount: 9 },
            rowHeights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            rowOffsets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
        };

        expect(getTopCoordinate(info, { index: 100 })).toEqual(960);
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
