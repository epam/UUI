import { measureAdaptiveItems, AdaptiveItemProps } from '../AdaptivePanel';

const items = [
    { id: 'container2', priority: 100, collapsedContainer: true },
    { id: '1', priority: 10 },
    { id: '2', priority: 2 },
    { id: '3', priority: 2 },
    { id: '4', priority: 3 },
    { id: 'container1', priority: 4, collapsedContainer: true },
    { id: '5', priority: 5 },
] as AdaptiveItemProps[];

const itemsWidth = {
    '1': 200,
    '2': 200,
    '3': 200,
    '4': 200,
    '5': 200,
    container1: 200,
    container2: 200,
};

describe('layout apaptive items', () => {
    it('should show all items if items width less than container', () => {
        expect(measureAdaptiveItems(items, 1000, itemsWidth)).toEqual({
            displayed: items.filter(i => !i.collapsedContainer),
            hidden: [],
            maxHiddenItemPriority: -1,
        });
    });

    it('should hide items with lower priorities when container width is not enough', () => {
        expect(measureAdaptiveItems(items, 600, itemsWidth)).toEqual({
            displayed: [
                { id: '1', priority: 10 },
                { id: 'container1', priority: 4, collapsedContainer: true },
                { id: '5', priority: 5 },
            ],
            hidden: [
                { id: '2', priority: 2 },
                { id: '3', priority: 2 },
                { id: '4', priority: 3 },
            ],
            maxHiddenItemPriority: 3,
        });
    });

    it('should hide all items with the same priority, if it least one item not fit', () => {
        expect(measureAdaptiveItems(items, 999, itemsWidth)).toEqual({
            displayed: [
                { id: '1', priority: 10 },
                { id: '4', priority: 3 },
                { id: 'container1', priority: 4, collapsedContainer: true },
                { id: '5', priority: 5 },
            ],
            hidden: [
                { id: '2', priority: 2 },
                { id: '3', priority: 2 },
            ],
            maxHiddenItemPriority: 2,
        });
    });

    it('should sown collapsedContainer with priority not lower than max hidden item priority', () => {
        expect(measureAdaptiveItems(items, 400, itemsWidth)).toEqual({
            displayed: [
                { id: 'container2', priority: 100, collapsedContainer: true },
                { id: '1', priority: 10 },
            ],
            hidden: [
                { id: '2', priority: 2 },
                { id: '3', priority: 2 },
                { id: '4', priority: 3 },
                { id: '5', priority: 5 },
            ],
            maxHiddenItemPriority: 5,
        });
    });

    it("if items don't have collapsed container just hide items which not fit", () => {
        expect(
            measureAdaptiveItems(
                items.filter(i => !i.collapsedContainer),
                400,
                itemsWidth
            )
        ).toEqual({
            displayed: [
                { id: '1', priority: 10 },
                { id: '5', priority: 5 },
            ],
            hidden: [
                { id: '2', priority: 2 },
                { id: '3', priority: 2 },
                { id: '4', priority: 3 },
            ],
            maxHiddenItemPriority: 3,
        });
    });
});
