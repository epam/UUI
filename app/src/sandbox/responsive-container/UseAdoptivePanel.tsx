import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import css from './UseAdoptivePanel.scss';
import orderBy from "lodash.orderby";

interface IItemsState {
    shownChildren: JSX.Element[];
    hiddenChildren: JSX.Element[];
}

interface IElement extends JSX.Element {
    props: { id: number, title: string, ["data-priority"]: number };
}

export const UseAdoptivePanel = (elements: IElement[], containerRef: React.MutableRefObject<HTMLDivElement>, spacing: number = 0) => {
    const [items, setItems] = useState<IItemsState>({ shownChildren: [], hiddenChildren: [] });

    const itemsByPriority = orderBy(elements, item => item.props["data-priority"], 'desc');

    const testDiv: HTMLDivElement = useMemo(() => {
        const testDiv = document.createElement('div');
        testDiv.setAttribute('class', css.testWrapper);
        return testDiv;
    }, []);

    const resizeHandler = () => {
        setItems(() => ({ shownChildren: [], hiddenChildren: [] }));

        const containerWidth = containerRef?.current ? Math.ceil(containerRef.current.getBoundingClientRect().width) : 0;
        let sumChildrenWidth = 0;

        const children = Array.from(testDiv.children);

        children.forEach((item, index) => {
            const itemWidth = Math.ceil(item.getBoundingClientRect().width) + spacing;
            if (sumChildrenWidth + itemWidth < containerWidth) {
                sumChildrenWidth += itemWidth;
                setItems((i) => ({ shownChildren: [...i.shownChildren, itemsByPriority[index]], hiddenChildren: [...i.hiddenChildren] }));
            } else {
                setItems((i) => ({ shownChildren: [...i.shownChildren], hiddenChildren: [...i.hiddenChildren, itemsByPriority[index]] }));

            }
        });
    };

    useEffect(() => {
        document.body.appendChild(testDiv);
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => {
            document.body.removeChild(testDiv);
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return {
        portal: ReactDOM.createPortal(itemsByPriority, testDiv),
        ...items,
    };
};

