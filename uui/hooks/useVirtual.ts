import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import type { PositionValues } from '@epam/uui-components';
import type ScrollBars from 'react-custom-scrollbars-2';
import type { IEditable } from '..';

interface UseVirtualApi<T> {
    estimatedHeight: number;
    scrollValues: PositionValues;
    offsetY: number;
    handleScroll: () => void;
    listRef: MutableRefObject<T>;
    scrollbarsRef: MutableRefObject<ScrollBars>;
};

interface UseVirtualValue {
    topIndex?: number;
    visibleCount?: number;
};

interface UseVirtualProps extends IEditable<UseVirtualValue> {
    rowsCount?: number;
    focusedIndex?: number;
    onScroll?(value: Partial<PositionValues>): void;
}

export function useVirtual<T>({
    onValueChange,
    value,
    rowsCount,
    focusedIndex = 0,
    onScroll
}: UseVirtualProps): UseVirtualApi<T> {
    const list = useRef<T extends HTMLElement ? T : never>();
    const scrollbars = useRef<ScrollBars | null>();
    const blockAlign = useRef(20);
    const rowHeights = useRef<number[]>([]);
    const rowOffsets = useRef<number[]>([]);
    const estimatedHeight = useRef(0);

    const updateScrollToFocus = useCallback(() => {
        if (!scrollbars.current) return;
        const { scrollTop, clientHeight } = scrollbars.current.getValues();
        const focusCoord = focusedIndex && rowOffsets.current[focusedIndex] || 0;
        const rowHeight = focusedIndex && rowHeights.current[focusedIndex] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollbars.current.scrollTop(focusCoord - clientHeight / 2 + rowHeight / 2);
        };
    }, [rowOffsets.current, scrollbars.current, focusedIndex]);

    const handleScroll = useCallback(() => {
        if (!scrollbars.current) return;
        if (onScroll) onScroll(scrollbars.current.getValues());
        const { scrollTop, clientHeight } = scrollbars.current.getValues();

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[Math.min(topIndex + blockAlign.current, rowsCount)] < scrollTop) {
            topIndex += blockAlign.current;
        }

        let bottomIndex = topIndex;
        while (bottomIndex < rowsCount && rowOffsets.current[Math.min(bottomIndex, rowsCount)] < (scrollTop + clientHeight)) {
            bottomIndex++;
        }

        const minVisibleCount = (bottomIndex - topIndex);
        if (topIndex !== value.topIndex || minVisibleCount > value.visibleCount) {
            const visibleCount = minVisibleCount + blockAlign.current * 2;
            onValueChange({ ...value, topIndex: topIndex, visibleCount });
        }
    }, [onValueChange, blockAlign.current, rowOffsets.current, rowsCount, value, onScroll, scrollbars.current]);

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

    useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    useEffect(updateScrollToFocus, [focusedIndex]);

    return {
        estimatedHeight: estimatedHeight.current,
        scrollValues: scrollbars.current?.getValues(),
        handleScroll,
        offsetY: rowOffsets.current[value?.topIndex || 0] || 0,
        scrollbarsRef: scrollbars,
        listRef: list,
    };
};