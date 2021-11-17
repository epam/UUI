import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import type { PositionValues, ScrollbarsApi } from '@epam/uui-components';
import type { IEditable, DataTableState } from '..';

interface UseVirtualApi<T> {
    estimatedHeight: number;
    scrollValues: PositionValues;
    offsetY: number;
    handleScroll: () => void;
    listRef: MutableRefObject<T>;
    scrollbarsRef: MutableRefObject<ScrollbarsApi>;
    scrollToIndex: (index: number) => void;
};

interface UseVirtualProps extends IEditable<Pick<DataTableState, 'focusedIndex' | 'topIndex' | 'visibleCount'>> {
    rowsCount: number;
    blockAlign?: number;
    onScroll?(value: Partial<PositionValues>): void;
}

export function useVirtual<T extends HTMLElement>({
    onValueChange,
    value,
    rowsCount,
    onScroll,
    blockAlign = 20
}: UseVirtualProps): UseVirtualApi<T> {
    const [focused, setFocused] = useState<number>(value.focusedIndex);
    const listRef = useRef<T>();
    const scrollbarsRef = useRef<ScrollbarsApi>();
    const rowHeights = useRef<number[]>([]);
    const rowOffsets = useRef<number[]>([]);
    const estimatedHeight = useRef<number>(0);

    const updateScrollToFocus = useCallback(() => {
        if (!scrollbarsRef.current || focused == undefined) return;
        const { scrollTop, clientHeight } = scrollbarsRef.current.getValues();
        const focusCoord = focused && rowOffsets.current[focused] || 0;
        const rowHeight = focused && rowHeights.current[focused] || 0;
        if (focusCoord < (scrollTop - rowHeight) || (scrollTop + clientHeight) < focusCoord) {
            scrollbarsRef.current.scrollTop(focusCoord - clientHeight / 2 + rowHeight / 2);
        };
    }, [rowOffsets.current, scrollbarsRef.current, focused]);

    const handleScroll = useCallback(() => {
        if (!scrollbarsRef.current) return;
        if (onScroll) onScroll(scrollbarsRef.current.getValues());
        const { scrollTop, clientHeight } = scrollbarsRef.current.getValues();

        let topIndex = 0;
        while (topIndex < rowsCount && rowOffsets.current[Math.min(topIndex + blockAlign, rowsCount)] < scrollTop) {
            topIndex += blockAlign;
        }

        let bottomIndex = topIndex;
        while (bottomIndex < rowsCount && rowOffsets.current[Math.min(bottomIndex, rowsCount)] < (scrollTop + clientHeight)) {
            bottomIndex++;
        }

        if (topIndex !== value.topIndex || (bottomIndex - topIndex) > value.visibleCount) {
            const visibleCount = (bottomIndex - topIndex) + blockAlign * 2;
            onValueChange({ ...value, topIndex: topIndex, visibleCount });
        };
    }, [onValueChange, blockAlign, rowOffsets.current, rowsCount, value, onScroll, scrollbarsRef.current]);

    const updateRowHeights = useCallback(() => {
        if (!listRef.current) return;
        const nodes = Array.from(listRef.current.children);
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
    }, [estimatedHeight.current, rowOffsets.current, rowsCount, listRef.current]);

    const scrollToIndex = useCallback((index: number) => {
        if (index < 0) throw new Error('Index is less than zero');
        if (index > rowsCount) throw new Error('Index exceeds the size of the list');
        setFocused(index);
        setTimeout(() => setFocused(undefined), 0);
    }, [focused]);

    useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        updateRowHeights();
        handleScroll();
    });

    useEffect(updateScrollToFocus, [focused]);

    return {
        estimatedHeight: estimatedHeight.current,
        scrollValues: scrollbarsRef.current?.getValues(),
        offsetY: rowOffsets.current[value?.topIndex || 0] || 0,
        scrollbarsRef,
        listRef,
        handleScroll,
        scrollToIndex,
    };
};