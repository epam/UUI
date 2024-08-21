import { orderBy } from '@epam/uui-core';
import { AdaptiveItemProps } from './types';

interface MeasuredItems {
    displayed: AdaptiveItemProps[];
    hidden: AdaptiveItemProps[];
    maxHiddenItemPriority: number;
}

const layoutItems = (
    items: AdaptiveItemProps[],
    containerWidth: number,
    itemsWidth: Record<string, number>,
    itemsGap: number,
    previousCollapsedContainerPriority?: number,
): MeasuredItems => {
    let sumChildrenWidth = 0;
    const itemsByPriority = orderBy(items, ({ priority }) => priority, 'desc');

    let maxHiddenItemPriority = previousCollapsedContainerPriority || -1;

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
        // if we have more than one collapsed container, we should take into account last hidden container priority to also hide other items with same priority at the same time
        let previousCollapsedContainer: AdaptiveItemProps = null;
        // if max hidden item priority more than collapsed container priority, try to re-layout items with another container with higher priority
        while (collapsedContainer === null || result.maxHiddenItemPriority >= collapsedContainer.priority) {
            previousCollapsedContainer = collapsedContainer;
            collapsedContainer = orderBy(
                // eslint-disable-next-line no-loop-func
                items.filter((i) => i.collapsedContainer && i.priority > result.maxHiddenItemPriority),
                ({ priority }) => priority,
            )[0];

            if (!collapsedContainer) {
                return result;
            }
            // eslint-disable-next-line no-loop-func
            const itemsWithCollapsedContainer = items.filter((i) => (i.collapsedContainer ? i.id === collapsedContainer.id : true));
            result = layoutItems(itemsWithCollapsedContainer, containerWidth, itemsWidth, itemsGap, previousCollapsedContainer?.priority);
        }
    }

    return result;
};
