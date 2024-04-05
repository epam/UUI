import { AdaptivePanel } from '../AdaptivePanel';
import { AdaptiveItemProps } from '../types';
import {
    renderSnapshotWithContextAsync, renderWithContextAsync, mockAdaptivePanelLayout, screen,
} from '@epam/uui-test-utils';
import React from 'react';

type TestItemType = AdaptiveItemProps<{ data?: { label: string } }>;

function getNItems(baseId: string, n: number, priority: number = 1): TestItemType[] {
    const genItem = (params: Pick<TestItemType, 'id' | 'priority'>): TestItemType => {
        return {
            id: params.id,
            priority: params.priority,
            collapsedContainer: false,
            data: { label: `Item ${params.id}` },
            render: (item) => <div data-testid="adaptive-item" data-label={ item.data.label } key={ item.id } />,
        };
    };
    const items: TestItemType[] = [];
    for (let i = 0; i < n; i++) {
        items.push(genItem({ id: `${baseId}-${i}`, priority }));
    }
    return items;
}

async function setupAdaptivePanel({ width, itemWidth, itemsGap }: { width: number; itemWidth: number; itemsGap?: number }) {
    const genContainerItem = ({ id, priority }: Pick<TestItemType, 'id' | 'priority'>): TestItemType => {
        return {
            id,
            priority,
            collapsedContainer: true,
            data: { label: `Collapsed Container Item ${id}` },
            render: (item, hiddenItems) => (
                <div key={ id } data-testid="adaptive-item-cc" data-label={ item.data.label } data-hiddenitems={ hiddenItems.map((i) => i.id).join(',') } />
            ),
        };
    };
    const items: TestItemType[] = [
        ...getNItems('p1', 3, 1),
        ...getNItems('p2', 3, 3),
        ...getNItems('p3', 3, 5),
        genContainerItem({ id: 'wide-screen', priority: 2 }),
        genContainerItem({ id: 'medium-screen', priority: 4 }),
        genContainerItem({ id: 'small-screen', priority: 6 }),
    ];
    mockAdaptivePanelLayout({ width, itemWidth });
    const result = await renderWithContextAsync(<AdaptivePanel items={ items } rawProps={ { 'data-testid': 'adaptive-panel' } } itemsGap={ itemsGap } />);
    const visibleItems = screen
        .queryAllByTestId('adaptive-item')
        .map((i) => i.getAttribute('data-label'))
        .join(',');
    const containerItem = screen.queryByTestId('adaptive-item-cc');
    const hiddenItems = containerItem.getAttribute('data-hiddenitems');
    return {
        result,
        visibleItems,
        hiddenItems,
        containerItem,
    };
}

describe('AdaptivePanel', () => {
    it('should render no items provided', async () => {
        const tree = await renderSnapshotWithContextAsync(<AdaptivePanel items={ [] } />);
        expect(tree).toMatchSnapshot();
    });

    it('should render some items', async () => {
        const tree = await renderSnapshotWithContextAsync(<AdaptivePanel items={ getNItems('snapshot', 5) } />);
        expect(tree).toMatchSnapshot();
    });

    it('should render some items with itemsGap', async () => {
        const tree = await renderSnapshotWithContextAsync(<AdaptivePanel itemsGap={ 6 } items={ getNItems('snapshot', 5) } />);
        expect(tree).toMatchSnapshot();
    });

    it('should properly collapse on WIDE screen', async () => {
        // 7 ( 6 items + 1 collapsed container) * 20 width = 140 Total width;
        const res = await setupAdaptivePanel({ width: 140, itemWidth: 20 });
        expect(res.visibleItems).toEqual('Item p2-0,Item p2-1,Item p2-2,Item p3-0,Item p3-1,Item p3-2');
        expect(res.containerItem).toBeInTheDocument();
        expect(res.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item wide-screen');
        expect(res.hiddenItems).toEqual('p1-0,p1-1,p1-2');
    });

    it('should properly collapse on WIDE screen with itemsGap', async () => {
        // 7 ( 6 items + 1 collapsed container) * 20 width + 6 gaps * 4px = 140+24 = 164 Total width;
        const res = await setupAdaptivePanel({ width: 164, itemWidth: 20, itemsGap: 4 });
        expect(res.visibleItems).toEqual('Item p2-0,Item p2-1,Item p2-2,Item p3-0,Item p3-1,Item p3-2');
        expect(res.containerItem).toBeInTheDocument();
        expect(res.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item wide-screen');
        expect(res.hiddenItems).toEqual('p1-0,p1-1,p1-2');
    });

    it('should properly collapse on MEDIUM screen', async () => {
        // 4 ( 3 items + 1 collapsed container) * 20 width = 80 Total width;
        const res = await setupAdaptivePanel({ width: 80, itemWidth: 20 });
        expect(res.visibleItems).toEqual('Item p3-0,Item p3-1,Item p3-2');
        expect(res.containerItem).toBeInTheDocument();
        expect(res.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item medium-screen');
        expect(res.hiddenItems).toEqual('p1-0,p1-1,p1-2,p2-0,p2-1,p2-2');
    });

    it('should properly collapse on MEDIUM screen with itemsGap', async () => {
        // 4 ( 3 items + 1 collapsed container) * 20 width + (3 gap * 4px )= 80 + 12 = 92 Total width;
        const res = await setupAdaptivePanel({ width: 92, itemWidth: 20, itemsGap: 4 });
        expect(res.visibleItems).toEqual('Item p3-0,Item p3-1,Item p3-2');
        expect(res.containerItem).toBeInTheDocument();
        expect(res.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item medium-screen');
        expect(res.hiddenItems).toEqual('p1-0,p1-1,p1-2,p2-0,p2-1,p2-2');
    });

    it('should properly collapse on SMALL screen', async () => {
        // 1 collapsed container * 20 width = 20 Total width;
        const res = await setupAdaptivePanel({ width: 20, itemWidth: 20 });
        expect(res.visibleItems).toEqual('');
        expect(res.containerItem).toBeInTheDocument();
        expect(res.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item small-screen');
        expect(res.hiddenItems).toEqual('p1-0,p1-1,p1-2,p2-0,p2-1,p2-2,p3-0,p3-1,p3-2');
    });

    it('should properly collapse on SMALL screen with itemsGap', async () => {
        // 1 collapsed container * 20 width = 20 Total width; (itemsGap doesn't have effect on the last item or on the collapsed container)
        const res = await setupAdaptivePanel({ width: 20, itemWidth: 20, itemsGap: 4 });
        expect(res.visibleItems).toEqual('');
        expect(res.containerItem).toBeInTheDocument();
        expect(res.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item small-screen');
        expect(res.hiddenItems).toEqual('p1-0,p1-1,p1-2,p2-0,p2-1,p2-2,p3-0,p3-1,p3-2');
    });
});
