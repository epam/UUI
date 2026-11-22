import React, { useState } from 'react';
import { act, renderWithContextAsync, screen } from '@epam/uui-test-utils';
import { useVirtualList } from '../index';
import { VirtualListState } from '../../../types';

const ROW_HEIGHT = 20;
const ROWS_COUNT = 1000;
const allRows = new Array(ROWS_COUNT).fill(undefined).map((_, index) =>
    <div key={ index } role="row">{index}</div>);

function TestList({ initialVisibleCount }: { initialVisibleCount: number }) {
    const [value, setValue] = useState<VirtualListState>({ topIndex: 0, visibleCount: initialVisibleCount });
    const {
        scrollContainerRef, listContainerRef, estimatedHeight, listOffset,
    } = useVirtualList<HTMLDivElement, HTMLDivElement>({ value, onValueChange: setValue, rowsCount: ROWS_COUNT });

    return (
        <div
            ref={ scrollContainerRef }
            data-testid="scroll-container"
            data-estimated-height={ estimatedHeight }
            data-list-offset={ String(listOffset) }
        >
            <div style={ { minHeight: `${estimatedHeight}px` } }>
                <div ref={ listContainerRef }>
                    { allRows.slice(value.topIndex, value.topIndex + value.visibleCount) }
                </div>
            </div>
        </div>
    );
}

describe('useVirtualList - scroll container gets its size after the first render', () => {
    // Emulates ScrollBars, which are initialized in useEffect, so the scroll container has no height on the first render.
    let isScrollContainerSized: boolean;
    let resizeObserverCallbacks: Array<() => void>;
    let disconnectMock: jest.Mock;
    const originalResizeObserver = global.ResizeObserver;

    beforeEach(() => {
        isScrollContainerSized = false;
        resizeObserverCallbacks = [];
        disconnectMock = jest.fn();

        global.ResizeObserver = jest.fn().mockImplementation((callback: () => void) => {
            resizeObserverCallbacks.push(callback);
            return { observe: jest.fn(), unobserve: jest.fn(), disconnect: disconnectMock };
        });

        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRectMock(this: HTMLElement) {
            if (this.dataset.testid === 'scroll-container') {
                const height = isScrollContainerSized ? 100 : 0;
                return { top: 0, bottom: height, height, left: 0, width: 0 } as DOMRect;
            }
            return { top: 0, bottom: ROW_HEIGHT, height: ROW_HEIGHT, left: 0, width: 0 } as DOMRect;
        });
    });

    afterEach(() => {
        global.ResizeObserver = originalResizeObserver;
        jest.restoreAllMocks();
    });

    it.each([20, 30])('should calculate estimatedHeight for all rows, when visibleCount is %i', async (visibleCount) => {
        await renderWithContextAsync(<TestList initialVisibleCount={ visibleCount } />);
        const scrollContainer = screen.getByTestId('scroll-container');

        // Scroll container has no size yet, so the list isn't initialized
        expect(scrollContainer.dataset.listOffset).toBe('undefined');
        expect(scrollContainer.dataset.estimatedHeight).toBe('0');

        // Scroll container gets its size
        isScrollContainerSized = true;
        act(() => {
            resizeObserverCallbacks.forEach((callback) => callback());
        });

        expect(scrollContainer.dataset.listOffset).toBe('0');
        // Height is estimated for all rows, not only for the first visibleCount rows, which are rendered
        expect(Number(scrollContainer.dataset.estimatedHeight)).toBe(ROWS_COUNT * ROW_HEIGHT);
        expect(disconnectMock).toHaveBeenCalled();
    });

    it('should not observe scroll container size, if it already has size on the first render', async () => {
        isScrollContainerSized = true;

        await renderWithContextAsync(<TestList initialVisibleCount={ 20 } />);
        const scrollContainer = screen.getByTestId('scroll-container');

        expect(global.ResizeObserver).not.toHaveBeenCalled();
        expect(scrollContainer.dataset.listOffset).toBe('0');
        expect(Number(scrollContainer.dataset.estimatedHeight)).toBe(ROWS_COUNT * ROW_HEIGHT);
    });
});
