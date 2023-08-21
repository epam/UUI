import { VirtualListState } from '../../../types';
import { assumeHeightForScrollToIndex, getAverageRowHeight, getNewEstimatedContainerHeight, getOffsetYForIndex, getRowsToFetchForScroll, getTopCoordinate, getTopIndexWithOffset, getUpdatedRowHeights, getUpdatedRowOffsets, getUpdatedRowsInfo } from '../../useVirtualList/utils';
import { VirtualListInfo } from '../../useVirtualList/VirtualListInfo';
import { createListContainer, createScrollContainer } from './helpers';

describe('getUpdatedRowHeights', () => {
    const scrollContainer = createScrollContainer();
    const creaateVirtualListInfo = (
        listContainer: HTMLDivElement,
        value: VirtualListState,
        rowHeights: number[],
    ) => new VirtualListInfo(
        scrollContainer,
        listContainer,
        value,
        100,
        20,
        20,
        rowHeights,
        [],
        10,
    );
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

    it('should update row offsets', () => {
        const info = new VirtualListInfo(
            scrollContainer,
            listContainer,
            {},
            10,
            20,
            20,
            new Array(11).fill(20),
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            50,
            undefined,
            15,
        );
        expect(getUpdatedRowOffsets(info)).toEqual([
            50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250,
        ]);
    });

    it('should use average height if row height is undefined or zero', () => {
        const info = new VirtualListInfo(
            scrollContainer,
            listContainer,
            {},
            10,
            20,
            20,
            new Array(11).fill(0),
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            50,
            undefined,
            15,
        );
        expect(getUpdatedRowOffsets(info)).toEqual([
            50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200,
        ]);

        const info2 = new VirtualListInfo(
            scrollContainer,
            listContainer,
            {},
            10,
            20,
            20,
            [],
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            50,
            undefined,
            15,
        );
        expect(getUpdatedRowOffsets(info2)).toEqual([
            50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200,
        ]);
    });
});

describe('getNewEstimatedContainerHeight', () => {
    it('should return new estimated height', () => {
        expect(getNewEstimatedContainerHeight([5, 15, 40, 100, 110], 4, 5)).toEqual(105);
    });
});

describe('getUpdatedRowsInfo', () => {
    it('should return old values if scroll container is not defined', () => {
        const info = new VirtualListInfo(
            undefined,
            createListContainer([]),
            {},
            10,
            20,
            20,
            [1],
            [16],
            50,
            20,
            15,
        );
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if list container is not defined', () => {
        const info = new VirtualListInfo(
            createScrollContainer(),
            undefined,
            {},
            10,
            20,
            20,
            [1],
            [16],
            50,
            20,
            15,
        );
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if list offset is not defined', () => {
        const info = new VirtualListInfo(
            createScrollContainer(),
            createListContainer([]),
            {},
            10,
            20,
            20,
            [1],
            [16],
            null,
            20,
            15,
        );
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });

        const info2 = new VirtualListInfo(
            createScrollContainer(),
            createListContainer([]),
            {},
            10,
            20,
            20,
            [1],
            [16],
            undefined,
            20,
            15,
        );
        expect(getUpdatedRowsInfo(info2)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return old values if value is not defined', () => {
        const info = new VirtualListInfo(
            createScrollContainer(),
            createListContainer([]),
            undefined,
            10,
            20,
            20,
            [1],
            [16],
            50,
            20,
            15,
        );
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1],
            rowOffsets: [16],
            estimatedHeight: 20,
        });
    });

    it('should return updated values', () => {
        const info = new VirtualListInfo(
            createScrollContainer(),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            10,
            20,
            20,
            [1, 1, 1],
            [16],
            50,
            20,
            15,
        );
        expect(getUpdatedRowsInfo(info)).toEqual({
            rowHeights: [1, 10, 20, 20, 20, 15, 10, 15],
            rowOffsets: [
                50,
                60,
                80,
                100,
                120,
                135,
                145,
                160,
                173.875,
                187.75,
                201.625,
            ],
            estimatedHeight: 151.625,
            averageRowHeight: 13.875,
        });
    });
});

describe('getRowsToFetchForScroll', () => {
    it('should limit topIndex with rowsCount', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 1000 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            5,
            1,
            1,
            [],
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            50,
            20,
            15,
        );
        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 1,
            topIndex: 4,
        });
    });

    it('should limit topIndex with scrollTop', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 1000 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            20,
            1,
            1,
            [],
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            50,
            20,
            15,
        );
        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 6,
            topIndex: 5,
        });
    });

    it('should limit visibleCount with rowsCount', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 1000 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            5,
            1,
            1,
            [],
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            50,
            20,
            15,
        );
        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 1,
            topIndex: 4,
        });
    });

    it('should limit visibleCount with clientHeight', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            100,
            1,
            0,
            [],
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            50,
            20,
            15,
        );
        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 1,
            topIndex: 6,
        });
    });

    it('should overdraw rows', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            100,
            1,
            5,
            [],
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            50,
            20,
            15,
        );
        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 11,
            topIndex: 1,
        });
    });

    it('should align to block size', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            5,
            2,
            0,
            [],
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            50,
            20,
            15,
        );
        expect(getRowsToFetchForScroll(info)).toEqual({
            visibleCount: 2,
            topIndex: 4,
        });
    });
});

describe('getTopCoordinate', () => {
    it('should get top coordinate for index to scroll by rowOffset', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1 },
            5,
            2,
            0,
            [10, 30, 50, 70, 85, 95, 110, 500, 510, 560],
            [10, 40, 90, 160, 245, 355, 855, 1365, 1925],
            50,
            20,
            15,
        );
        expect(getTopCoordinate(info, 3)).toEqual(110);
    });

    it('should assume top coordinate for index to scroll by rowOffset', () => {
        const info = new VirtualListInfo(
            createScrollContainer({ scrollTop: 100, clientHeight: 200 }),
            createListContainer([10, 20, 20, 20, 15, 10, 15]),
            { topIndex: 1, visibleCount: 9 },
            5,
            2,
            0,
            [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
            50,
            20,
            15,
        );
        expect(getTopCoordinate(info, 100)).toEqual(960);
    });
});

describe('assumeHeightForScrollToIndex', () => {
    it('should assume height for scroll to index', () => {
        expect(assumeHeightForScrollToIndex({ topIndex: 5, visibleCount: 10, scrollTo: { index: 100 } }, 100, 10))
            .toEqual(950);
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
