import { AdaptiveItemProps, AdaptivePanel } from '../AdaptivePanel';
import { renderSnapshotWithContextAsync, renderToJsdomWithContextAsync, mockAdaptivePanelLayout } from '@epam/test-utils';
import React from 'react';

type TestItemType = AdaptiveItemProps<{data?: {label: string}}>;

const genContainerItem = ({ id, priority }: Pick<TestItemType, 'id' | 'priority'>): TestItemType => {
    return {
        id, priority, collapsedContainer: true, data: { label: `Collapsed Container Item ${id}` },
        render: (item, hiddenItems) => (
            <div
                key={ id }
                data-testid="adaptive-item-cc"
                data-label={ item.data.label }
                data-hiddenitems={ hiddenItems.map(i => i.id).join(',') }
            />
        ),
    };
};

function getNItems(baseId: string, n: number, priority: number = 1): TestItemType[] {
    const genItem = ({ id, priority }: Pick<TestItemType, 'id' | 'priority'>): TestItemType => {
        return {
            id, priority, collapsedContainer: false, data: { label: `Item ${id}` },
            render: (item) => (<div data-testid="adaptive-item" data-label={ item.data.label } key={ item.id } />),
        };
    };
    const items: TestItemType[] = [];
    for (let i = 0; i < n; i++) {
        items.push(genItem({ id: `${baseId}-${i}`, priority }));
    }
    return items;
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

    it('should properly choose "collapse container" & collapse items depending on available space', async () => {
        const items: TestItemType[] = [
            ...getNItems('p1', 3, 1),
            ...getNItems('p2', 3, 3),
            ...getNItems('p3', 3, 5),
            genContainerItem({ id: 'wide-screen', priority: 2 }),
            genContainerItem({ id: 'medium-screen', priority: 4 }),
            genContainerItem({ id: 'small-screen', priority: 6 }),
        ];
        let layoutMock = mockAdaptivePanelLayout({ width: 140, itemWidth: 20 });
        const renderUseCase = async () => {
            let result = await renderToJsdomWithContextAsync(<AdaptivePanel items={ items } rawProps={ { 'data-testid': 'adaptive-panel'} } />);
            let visibleItems = result.queryAllByTestId('adaptive-item').map(i => i.getAttribute('data-label')).join(',');
            let containerItem = result.queryByTestId('adaptive-item-cc');
            let hiddenItems = containerItem.getAttribute('data-hiddenitems');
            return { result, visibleItems, hiddenItems, containerItem };
        };
        //
        // Wide screen
        //
        const useCase1 = await renderUseCase();
        expect(useCase1.visibleItems).toEqual('Item p2-0,Item p2-1,Item p2-2,Item p3-0,Item p3-1,Item p3-2');
        expect(useCase1.containerItem).toBeInTheDocument();
        expect(useCase1.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item wide-screen');
        expect(useCase1.hiddenItems).toEqual('p1-0,p1-1,p1-2');
        layoutMock.mockClear();
        useCase1.result.unmount();
        //
        // Medium screen
        //
        layoutMock = mockAdaptivePanelLayout({ width: 100, itemWidth: 20 });
        const useCase2 = await renderUseCase();
        expect(useCase2.visibleItems).toEqual('Item p3-0,Item p3-1,Item p3-2');
        expect(useCase2.containerItem).toBeInTheDocument();
        expect(useCase2.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item medium-screen');
        expect(useCase2.hiddenItems).toEqual('p1-0,p1-1,p1-2,p2-0,p2-1,p2-2');
        layoutMock.mockClear();
        useCase2.result.unmount();
        //
        // Small screen
        //
        layoutMock = mockAdaptivePanelLayout({ width: 30, itemWidth: 20 });
        const useCase3 = await renderUseCase();
        expect(useCase3.visibleItems).toEqual('');
        expect(useCase3.containerItem).toBeInTheDocument();
        expect(useCase3.containerItem.getAttribute('data-label')).toEqual('Collapsed Container Item small-screen');
        expect(useCase3.hiddenItems).toEqual('p1-0,p1-1,p1-2,p2-0,p2-1,p2-2,p3-0,p3-1,p3-2');
        layoutMock.mockClear();
        useCase3.result.unmount();
    });
});
