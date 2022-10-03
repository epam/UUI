import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import css from './AdaptivePanel.scss';
import { FlexRow } from "./flexItems";
import sortBy from "lodash.sortby";
import { IHasCX } from "@epam/uui-core";

export type AdaptiveItemProps<T = unknown> = T & {
    render: (item: AdaptiveItemProps<T>, hiddenItems: AdaptiveItemProps<T>[]) => any;
    priority: number;
    collapsedContainer?: boolean;
    id: string;
};

interface AdaptivePanelProps extends IHasCX {
    items: AdaptiveItemProps[];
}

interface MeasuredItems {
    shown: AdaptiveItemProps[];
    hidden: AdaptiveItemProps[];
    maxHiddenItemPriority: number;
}

const layoutItems = (items: AdaptiveItemProps[], containerWidth: number, itemsWidth: Record<string, number>): MeasuredItems => {
    let sumChildrenWidth = 0;
    const itemsByPriority = sortBy(items, i => i.priority).reverse();

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
        shown: items.filter(i => i.priority > maxHiddenItemPriority),
        hidden: items.filter(i => i.priority <= maxHiddenItemPriority),
        maxHiddenItemPriority: maxHiddenItemPriority,
    };
};

export const measureAdaptiveItems = (items: AdaptiveItemProps[], containerWidth: number, itemsWidth: Record<string, number>): MeasuredItems => {
    const itemsWithoutCollapsedContainer = items.filter(i => !i.collapsedContainer);

    let result: MeasuredItems = layoutItems(itemsWithoutCollapsedContainer, containerWidth, itemsWidth);
    if (result.hidden.length > 0) {
        let collapsedContainer: AdaptiveItemProps = null;
        // if max hidden item priority more than collapsed container priority, try to re-layout items with another container with higher priority
        while (collapsedContainer === null || result.maxHiddenItemPriority >= collapsedContainer.priority) {
            collapsedContainer = sortBy(items.filter(i => i.collapsedContainer && i.priority > result.maxHiddenItemPriority), i => i.priority)[0];
            if (!collapsedContainer) {
                return result;
            }
            const itemsWithCollapsedContainer = items.filter(i => i.collapsedContainer ? i.id === collapsedContainer.id : true);
            result = layoutItems(itemsWithCollapsedContainer, containerWidth, itemsWidth);
        }
    }

    return result;
};

export const AdaptivePanel = (props: AdaptivePanelProps) => {
    const [itemsWidth, setItemsWidth] = useState<Record<string, number>>();
    const [isChanged, setIsChanged] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const shownRowRef = useRef<HTMLDivElement>(null);

    const getItemsWidth = () => {
        if (!shownRowRef.current) {
            return;
        }
        const children = Array.from(shownRowRef.current.children);

        if (!children.length) return;
        const itemsWidth: Record<string, number> = {};
        children.forEach((child, index) => { itemsWidth[props.items[index].id] = child.getBoundingClientRect().width; });

        return itemsWidth;
    };

    useLayoutEffect(() => {
        if (isChanged || !itemsWidth) {
            const newItemsWidth = getItemsWidth();
            setItemsWidth(newItemsWidth);
            setIsChanged(false);
        }
    });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((e) => {
            setIsChanged(true);
        });

        resizeObserver.observe(shownRowRef.current);
        resizeObserver.observe(wrapperRef.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const renderItems = () => {
        if (isChanged || !itemsWidth) {
            return props.items.map(i => i.render(i, []));
        }
        const wrapperWidth = wrapperRef?.current ? wrapperRef.current.getBoundingClientRect().width : 0;

        const measuredItems = measureAdaptiveItems(props.items, wrapperWidth, itemsWidth);
        return measuredItems.shown.map(i => i.render(i, measuredItems.hidden));
    };

    return (
        <div className={ css.mainWrapper } ref={ wrapperRef }>
            <FlexRow cx={ [css.adaptiveRow, props.cx] } ref={ shownRowRef }>
                { renderItems() }
            </FlexRow>
        </div>
    );
};