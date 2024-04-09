import sortBy from 'lodash.sortby';
import { AdaptiveItemProps } from './types';

interface MeasuredItems {
    displayed: AdaptiveItemProps[];
    hidden: AdaptiveItemProps[];
    maxHiddenItemPriority: number;
}

const layoutItems = (items: AdaptiveItemProps[], containerWidth: number, itemsWidth: Record<string, number>, itemsGap: number): MeasuredItems => {
    let sumChildrenWidth = 0;
    const itemsByPriority = sortBy(items, (i) => i.priority).reverse();

    let maxHiddenItemPriority = -1;

    itemsByPriority.forEach((item) => {
        if (sumChildrenWidth + itemsWidth[item.id] > containerWidth) {
            if (item.priority > maxHiddenItemPriority) {
                maxHiddenItemPriority = item.priority;
            }
        }
        sumChildrenWidth += itemsWidth[item.id] + itemsGap;
    });

    return {
        displayed: items.filter((i) => i.priority > maxHiddenItemPriority),
        hidden: items.filter((i) => i.priority <= maxHiddenItemPriority),
        maxHiddenItemPriority: maxHiddenItemPriority,
    };
};
export const measureAdaptiveItems = (items: AdaptiveItemProps[], containerWidth: number, itemsWidth: Record<string, number>, itemsGap: number): MeasuredItems => {
    const itemsWithoutCollapsedContainer = items.filter((i) => !i.collapsedContainer);

    let result: MeasuredItems = layoutItems(itemsWithoutCollapsedContainer, containerWidth, itemsWidth, itemsGap);
    if (result.hidden.length > 0) {
        let collapsedContainer: AdaptiveItemProps = null;
        // if max hidden item priority more than collapsed container priority, try to re-layout items with another container with higher priority
        while (collapsedContainer === null || result.maxHiddenItemPriority >= collapsedContainer.priority) {
            collapsedContainer = sortBy(
                items.filter((i) => i.collapsedContainer && i.priority > result.maxHiddenItemPriority),
                (i) => i.priority,
            )[0];
            if (!collapsedContainer) {
                return result;
            }
            const itemsWithCollapsedContainer = items.filter((i) => (i.collapsedContainer ? i.id === collapsedContainer.id : true));
            result = layoutItems(itemsWithCollapsedContainer, containerWidth, itemsWidth, itemsGap);
        }
    }

    return result;
};
