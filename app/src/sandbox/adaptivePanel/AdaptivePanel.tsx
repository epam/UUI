import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import css from './AdaptivePanel.scss';
import { Button, FlexRow } from "@epam/promo";

interface AdaptivePanelState {
    shown: React.ReactElement[];
    hidden: React.ReactElement[];
}

export interface AdoptiveItemProps {
    render: (hiddenItems?: AdoptiveItemProps[]) => any;
    priority?: number;
    collapsedContainer?: boolean;
    id: number;
}

interface AdaptivePanelProps {
    items: AdoptiveItemProps[];
}

interface MeasuredItems {
    shown: AdoptiveItemProps[];
    hidden: AdoptiveItemProps[];
}

export const AdaptivePanel = (props: AdaptivePanelProps) => {
    const [itemsWidth, setItemsWidth] = useState<Record<number, number>>();
    const [isChanged, setIsChanged] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const shownRowRef = useRef<HTMLDivElement>(null);

    const layoutItems = (items: AdoptiveItemProps[], containerWidth: number): MeasuredItems => {
        let sumChildrenWidth = 0;
        const result: any = { shown: [], hidden: [] };

        items.forEach((item, index) => {
            if (sumChildrenWidth + itemsWidth[index] < containerWidth) {
                result.shown.push(props.items[index]);
            } else {
                result.hidden.push(props.items[index]);
            }
            sumChildrenWidth += itemsWidth[index];
        });

        return result;
    };

    const measureItems = (): MeasuredItems => {
        const containerWidth = wrapperRef?.current ? wrapperRef.current.getBoundingClientRect().width : 0;

        const itemsWithoutCollapsedContainer = props.items.filter(i => !i.collapsedContainer);

        let result: MeasuredItems = layoutItems(itemsWithoutCollapsedContainer, containerWidth);
        if (result.hidden.length > 0) {
            return layoutItems(props.items, containerWidth);
        }

        return result;
    };

    const measureItemsWidth = () => {
        const children = Array.from(shownRowRef.current.children);

        if (!children.length) return;
        const itemsWidth: Record<number, number> = {};
        children.forEach((child, index) => { itemsWidth[index] = child.getBoundingClientRect().width; });
        console.log('items width', itemsWidth);
        return itemsWidth;
    };

    useLayoutEffect(() => {
        if (isChanged === true || !itemsWidth) {
            const newItemsWidth = measureItemsWidth();
            setItemsWidth(newItemsWidth);
            setIsChanged(false);
        }
    });

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setIsChanged(true);
        });

        resizeObserver.observe(shownRowRef.current);
        resizeObserver.observe(wrapperRef.current);
        return () => {
            resizeObserver.unobserve(shownRowRef.current);
            resizeObserver.unobserve(wrapperRef.current);
        };
    }, []);

    const renderItems = () => {
        if (isChanged || !itemsWidth) {
            return props.items.map(i => i.render());
        }
        const measuredItems = measureItems();
        return measuredItems.shown.map(i => i.collapsedContainer ? i.render(measuredItems.hidden) : i.render());
    };

    return (
        <div className={ css.mainWrapper } ref={ wrapperRef }>
            <FlexRow cx={ css.adaptiveRow } ref={ shownRowRef }>
                { renderItems() }
            </FlexRow>
        </div>
    );
};