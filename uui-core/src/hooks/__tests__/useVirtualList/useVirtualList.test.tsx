import React from 'react';
import { renderHookWithContextAsync, renderWithContextAsync } from '@epam/uui-test-utils';
import { useVirtualList } from '../../useVirtualList';

interface Props {
    scrollContainerRef: React.MutableRefObject<HTMLDivElement>;
    listContainerRef: React.MutableRefObject<HTMLDivElement>;
    estimatedHeight: number;
}
const rows = new Array(1000).fill(undefined).map((_, index) => 
    <div key={ index } style={ { height: '20px' } }>{index}</div>);

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

    it('should render with minimum props', async () => {
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
});
