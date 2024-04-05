import { getOrderComparer } from '@epam/uui-core';
import { AdaptiveItemProps } from './types';

interface MeasuredItems {
    displayed: AdaptiveItemProps[];
    hidden: AdaptiveItemProps[];
    maxHiddenItemPriority: number;
}

const layoutItems = (items: AdaptiveItemProps[], containerWidth: number, itemsWidth: Record<string, number>): MeasuredItems => {
    let sumChildrenWidth = 0;
    const comparer = getOrderComparer([{ field: 'priority', direction: 'desc' }]);
    const itemsByPriority = [...items].sort(comparer);

    let maxHiddenItemPriority = -1;

    itemsByPriority.forEach((item) => {
        if (sumChildrenWidth + itemsWidth[item.id] > containerWidth) {
            if (item.priority > maxHiddenItemPriority) {
                maxHiddenItemPriority = item.priority;
            }
        }
        sumChildrenWidth += itemsWidth[item.id];
    });

    return {
        displayed: items.filter((i) => i.priority > maxHiddenItemPriority),
        hidden: items.filter((i) => i.priority <= maxHiddenItemPriority),
        maxHiddenItemPriority: maxHiddenItemPriority,
    };
};
export const measureAdaptiveItems = (items: AdaptiveItemProps[], containerWidth: number, itemsWidth: Record<string, number>): MeasuredItems => {
    const itemsWithoutCollapsedContainer = items.filter((i) => !i.collapsedContainer);

    let result: MeasuredItems = layoutItems(itemsWithoutCollapsedContainer, containerWidth, itemsWidth);
    if (result.hidden.length > 0) {
        let collapsedContainer: AdaptiveItemProps = null;
        const comparer = getOrderComparer([{ field: 'priority', direction: 'asc' }]);
        // if max hidden item priority more than collapsed container priority, try to re-layout items with another container with higher priority
        while (collapsedContainer === null || result.maxHiddenItemPriority >= collapsedContainer.priority) {
            collapsedContainer = items
                // eslint-disable-next-line no-loop-func
                .filter((i) => i.collapsedContainer && i.priority > result.maxHiddenItemPriority)
                .sort(comparer)[0];
            if (!collapsedContainer) {
                return result;
            }
            // eslint-disable-next-line no-loop-func
            const itemsWithCollapsedContainer = items.filter((i) => (i.collapsedContainer ? i.id === collapsedContainer.id : true));
            result = layoutItems(itemsWithCollapsedContainer, containerWidth, itemsWidth);
        }
    }

    return result;
};
