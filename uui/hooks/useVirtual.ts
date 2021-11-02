import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import type { PositionValues, ScrollbarsApi } from '@epam/uui-components';
import type { IEditable } from '..';

interface UseVirtualApi<T> {
    estimatedHeight: number;
    scrollValues: PositionValues;
    offsetY: number;
    handleScroll: () => void;
    listRef: MutableRefObject<T>;
    scrollbarsRef: MutableRefObject<ScrollbarsApi>;
    scrollToIndex: (index: number) => void;
};

interface UseVirtualValue {
    topIndex?: number;
    visibleCount?: number;
};

interface UseVirtualProps extends IEditable<UseVirtualValue> {
    rowsCount: number;
    focusedIndex: number;
    overscan?: number;
    onScroll?(value: Partial<PositionValues>): void;
}

export function useVirtual<T extends HTMLElement>({
    onValueChange,
    value,
    rowsCount,
    focusedIndex,
    onScroll,
    overscan = 20
}: UseVirtualProps): UseVirtualApi<T> {
    const [focused, setFocused] = useState<number>(focusedIndex);
    const list = useRef<T>();
    const scrollbars = useRef<ScrollbarsApi | null>();
    const rowHeights = useRef<number[]>([]);
    const rowOffsets = useRef<number[]>([]);
    const estimatedHeight = useRef<number>(0);

    const updateScrollToFocus = useCallback(() => {
        if (!scrollbars.current || focused == undefined) return;
        const { scrollTop, clientHeight } = scrollbars.current.getValues();
        const focusCoord = focused && rowOffsets.current[focused] || 0;
        const rowHeight = focused && rowHeights.current[focused] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollbars.current.scrollTop(focusCoord - clientHeight / 2 + rowHeight / 2);
        };
    }, [rowOffsets.current, scrollbars.current, focused]);

    const handleScroll = useCallback(() => {
        if (!scrollbars.current) return;
        if (onScroll) onScroll(scrollbars.current.getValues());
        const { scrollTop, clientHeight } = scrollbars.current.getValues();

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[Math.min(topIndex + overscan, rowsCount)] < scrollTop) {
            topIndex += overscan;
        }

        let bottomIndex = topIndex;
        while (bottomIndex < rowsCount && rowOffsets.current[Math.min(bottomIndex, rowsCount)] < (scrollTop + clientHeight)) {
            bottomIndex++;
        }

        if (topIndex !== value.topIndex || (bottomIndex - topIndex) > value.visibleCount) {
            const visibleCount = (bottomIndex - topIndex) + overscan * 2;
            onValueChange({ ...value, topIndex: topIndex, visibleCount });
        }
    }, [onValueChange, overscan, rowOffsets.current, rowsCount, value, onScroll, scrollbars.current]);

    const updateRowHeights = useCallback(() => {
        if (!list.current) return;
        const nodes = Array.from(list.current.children);
        const topIndex = value?.topIndex || 0;

        nodes.forEach((node, index) => {
            const nodeHeight =  node.getBoundingClientRect().height;
            if (!nodeHeight) return;
            rowHeights.current[topIndex + index] = nodeHeight;
        });

        const averageHeight = rowHeights.current.length === 0 ?
            rowHeights.current.length + 1 :
            rowHeights.current.reduce((sum, next) => sum + next, 0) / rowHeights.current.length;

        rowOffsets.current = [];
        let lastOffset = 0;
        for (let n = 0; n < rowsCount; n++) {
            rowOffsets.current[n] = lastOffset;
            lastOffset += rowHeights.current[n] || averageHeight;
        };

        estimatedHeight.current = lastOffset;
    }, [estimatedHeight.current, rowOffsets.current, rowsCount, list.current]);

    const scrollToIndex = useCallback((index: number) => {
        if (index < 0) throw new Error('Index is less than zero');
        if (index > rowsCount) throw new Error('Index exceeds the size of the list');
        setFocused(index);
        requestAnimationFrame(() => setFocused(undefined));
    }, [focused]);

    useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    useEffect(() => {
        updateScrollToFocus();
    }, [focused]);

    return {
        estimatedHeight: estimatedHeight.current,
        scrollValues: scrollbars.current?.getValues(),
        handleScroll,
        offsetY: rowOffsets.current[value?.topIndex || 0] || 0,
        scrollbarsRef: scrollbars,
        listRef: list,
        scrollToIndex,
    };
};