import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useLayoutEffectSafeForSsr } from '@epam/uui-core';
import { measureAdaptiveItems } from './measureItemsUtils';
import type { AdaptivePanelProps } from './types';

import css from './AdaptivePanel.module.scss';

export function AdaptivePanel(props: AdaptivePanelProps) {
    const [itemsWidth, setItemsWidth] = useState<Record<string, number>>();
    const [isChanged, setIsChanged] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const displayedRowRef = useRef<HTMLDivElement>(null);
    const itemsGap = props.itemsGap ? Number(props.itemsGap) : 0;

    const getItemsWidth = () => {
        if (!displayedRowRef.current) {
            return;
        }
        const children = Array.from(displayedRowRef.current.children);

        if (!children.length) return;
        const calculatedItemsWidth: Record<string, number> = {};

        children.forEach((child, index) => {
            calculatedItemsWidth[props.items[index].id] = Math.floor(child.getBoundingClientRect().width);
        });

        return calculatedItemsWidth;
    };

    useLayoutEffectSafeForSsr(() => {
        if (isChanged || !itemsWidth) {
            const newItemsWidth = getItemsWidth();
            setItemsWidth(newItemsWidth);
            setIsChanged(false);
        }
    });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) =>
            requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) return;
                setIsChanged(true);
            }));

        resizeObserver.observe(displayedRowRef.current);
        resizeObserver.observe(wrapperRef.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const renderItems = () => {
        if (isChanged || !itemsWidth) {
            return props.items.map((i) => i.render(i, [], props.items));
        }
        const wrapperWidth = wrapperRef?.current ? Math.floor(wrapperRef.current.getBoundingClientRect().width) : 0;

        const measuredItems = measureAdaptiveItems(props.items, wrapperWidth, itemsWidth, itemsGap);
        return measuredItems.displayed.map((i) => i.render(i, measuredItems.hidden, measuredItems.displayed));
    };

    let styles;

    if (props.itemsGap) {
        styles = {
            columnGap: `${props.itemsGap}px`,
        };
    }

    return (
        <div { ...props.rawProps } className={ cx(props.cx, css.mainWrapper) } ref={ wrapperRef }>
            <div className={ css.itemsWrapper } style={ styles } ref={ displayedRowRef }>{ renderItems() }</div>
        </div>
    );
}
