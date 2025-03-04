import React from 'react';
import { act, renderHookWithContextAsync, renderWithContextAsync } from '@epam/uui-test-utils';
import { useVirtualList } from '../index';
import { VirtualListState } from '../../../types';

interface Props {
    scrollContainerRef: React.MutableRefObject<HTMLDivElement>;
    listContainerRef: React.MutableRefObject<HTMLDivElement>;
    estimatedHeight: number;
}
const rows = new Array(1000).fill(undefined).map((_, index) => 
    <div key={ index } style={ { height: '20px' } } role="row">{index}</div>);

function VirtualListContainer({ scrollContainerRef, listContainerRef, estimatedHeight }: Props) {
    return (
        <div style={ { height: '100px' } }>
            <div style={ { height: '100%' } }>
                <div ref={ scrollContainerRef }>
                    <div style={ { minHeight: `${estimatedHeight}px` } }>
                        <div ref={ listContainerRef }>
                            {rows}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

describe('useVirtualList', () => {
    beforeEach(() => {
        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
            return {
                width: 0,
                height: 20,
                top: 0,
                left: 0,
            } as DOMRect;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with required estimatedHeight', async () => {
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value: { topIndex: 0, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 20,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({
            value: { topIndex: 0, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 10,
        });
        
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(200);
        expect(result.current.offsetY).toBe(0);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');
    });
    
    it('should render with offsetY for topIndex more than 0', async () => {
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value: { topIndex: 20, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 40,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({
            value: { topIndex: 20, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 40,
        });
        
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(800);
        expect(result.current.offsetY).toBe(400);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');
    });
    
    it('should change offsetY according to the new topIndex', async () => {
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value: { topIndex: 20, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 50,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({
            value: { topIndex: 20, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 50,
        });
        
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(1000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');

        expect(result.current.offsetY).toBe(400);
        
        rerender({
            value: { topIndex: 40, visibleCount: 10 },
            onValueChange: () => {},
            rowsCount: 50,
        });
        expect(result.current.offsetY).toBe(800);
    });
        
    it('should scroll to index', async () => {
        let value = { topIndex: 20, visibleCount: 10 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });
        const onScroll = jest.fn();

        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            onScroll,
            rowsCount: 500,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        expect(onScroll).toBeCalledTimes(3);

        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(10000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');

        expect(result.current.offsetY).toBe(400);
        const scrollTo = { index: 100 };
        rerender({ value: { ...value, scrollTo }, onValueChange, onScroll, rowsCount: 500 });
        expect(onScroll).toBeCalledTimes(4);

        expect(onValueChange).toHaveBeenLastCalledWith({ visibleCount: 20, scrollTo, topIndex: 80 });
  
        rerender({ value: { ...value, scrollTo }, onValueChange, onScroll, rowsCount: 500 });
        expect(onScroll).toBeCalledTimes(6);

        expect(result.current.offsetY).toBe(1600);
        expect(result.current.estimatedHeight).toBe(10000);
    });
    
    it('should scroll to index on scrollToIndex call', async () => {
        let value = { topIndex: 20, visibleCount: 10 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });
        const onScroll = jest.fn();

        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            rowsCount: 500,
            onScroll,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(onScroll).toBeCalledTimes(3);
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(10000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');

        expect(result.current.offsetY).toBe(400);

        expect(onValueChange).toBeCalledTimes(3);
        
        result.current.scrollToIndex({ index: 100, behavior: 'auto' });

        expect(onScroll).toBeCalledTimes(3);
        expect(onValueChange).toBeCalledTimes(4);
        expect(onValueChange).toHaveBeenLastCalledWith({
            topIndex: 80,
            visibleCount: 20,
            scrollTo: { index: 100, behavior: 'auto' },
        });

        rerender({ value, onValueChange, onScroll, rowsCount: 500 });

        expect(onScroll).toBeCalledTimes(5);
        expect(onValueChange).toBeCalledTimes(6);
        
        act(() => result.current.scrollToIndex({ index: 100, behavior: 'auto' }));
        
        expect(onScroll).toBeCalledTimes(5);
        expect(onValueChange).toBeCalledTimes(7);
        expect(result.current.offsetY).toBe(1600);
        expect(result.current.estimatedHeight).toBe(10000);
    });

    it('should scroll to index if scrollTo was changed', async () => {
        let value = { topIndex: 20, visibleCount: 10 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });
        const onScroll = jest.fn();
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            rowsCount: 500,
            onScroll,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(onScroll).toBeCalledTimes(3);
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(10000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');

        expect(result.current.offsetY).toBe(400);

        expect(onValueChange).toBeCalledTimes(3);
        
        rerender({ value: { ...value, scrollTo: { index: 100 } }, onValueChange, onScroll, rowsCount: 500 });
        
        expect(onScroll).toBeCalledTimes(4);
        expect(onValueChange).toBeCalledTimes(4);
        expect(onValueChange).toHaveBeenLastCalledWith({ topIndex: 80, visibleCount: 20, scrollTo: { index: 100 } });

        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(onScroll).toBeCalledTimes(6);
        expect(onValueChange).toBeCalledTimes(6);
        
        act(() => result.current.scrollToIndex({ index: 100, behavior: 'auto' }));
        
        expect(onScroll).toBeCalledTimes(6);
        expect(onValueChange).toBeCalledTimes(7);
        expect(result.current.offsetY).toBe(1600);
        expect(result.current.estimatedHeight).toBe(10000);
    });
    
    it('should execute handleScroll correctly', async () => {
        let value = { topIndex: 20, visibleCount: 10 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });
        const onScroll = jest.fn();
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            rowsCount: 500,
            onScroll,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(10000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');
        expect(onScroll).toBeCalledTimes(3);

        result.current.scrollContainerRef.current.scrollTop = 2000;

        act(() => result.current.handleScroll?.(undefined as any));
        
        expect(onScroll).toBeCalledTimes(4);
        expect(onValueChange).toBeCalledTimes(4);
        expect(onValueChange).toHaveBeenLastCalledWith({ topIndex: 80, visibleCount: 40 });
    });
    
    it('should execute on rerender handleScroll', async () => {
        let value = { topIndex: 20, visibleCount: 10 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });
        const onScroll = jest.fn();
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            rowsCount: 500,
            onScroll,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(10000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');
        expect(onScroll).toBeCalledTimes(3);

        result.current.scrollContainerRef.current.scrollTop = 2000;

        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(onScroll).toBeCalledTimes(4);
        expect(onValueChange).toBeCalledTimes(4);
        expect(onValueChange).toHaveBeenLastCalledWith({ topIndex: 80, visibleCount: 40 });
    });
    
    it('should not update value if not necessary on rerender', async () => {
        let value = { topIndex: 20, visibleCount: 10 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });
        const onScroll = jest.fn();
        const { result, rerender } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            rowsCount: 500,
            onScroll,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        
        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();
        expect(result.current.estimatedHeight).toBe(10000);
        expect(result.current.listOffset).toBe(0);
        expect(typeof result.current.scrollToIndex).toBe('function');
        expect(typeof result.current.handleScroll).toBe('function');
        expect(onScroll).toBeCalledTimes(3);

        result.current.scrollContainerRef.current.scrollTop = 2000;

        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        expect(onScroll).toBeCalledTimes(4);
        expect(onValueChange).toBeCalledTimes(4);
        expect(onValueChange).toHaveBeenLastCalledWith({ topIndex: 80, visibleCount: 40 });
        
        rerender({ value, onValueChange, onScroll, rowsCount: 500 });
        expect(onScroll).toBeCalledTimes(5);
        expect(onValueChange).toBeCalledTimes(4);
        expect(onValueChange).toHaveBeenLastCalledWith({ topIndex: 80, visibleCount: 40 });
    });

    it('should change topIndex and visibleCount to last visible block, if topIndex + visibleCount greater than maximum rowCount', async () => {
        let value = { topIndex: 120, visibleCount: 20 } as VirtualListState;
        const onValueChange = jest.fn().mockImplementation((newValue) => {
            value = newValue;
        });

        const { result } = await renderHookWithContextAsync(useVirtualList, {
            value,
            onValueChange,
            rowsCount: 65,
        });

        await renderWithContextAsync(
            <VirtualListContainer
                scrollContainerRef={ result.current.scrollContainerRef }
                listContainerRef={ result.current.listContainerRef }
                estimatedHeight={ result.current.estimatedHeight }
            />,
        );

        expect(result.current.scrollContainerRef.current).toBeInTheDocument();
        expect(result.current.listContainerRef.current).toBeInTheDocument();

        expect(onValueChange).toHaveBeenLastCalledWith({ topIndex: 60, visibleCount: 20 }); // last visible block
    });
});
