import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import css from './AdoptivePanel.scss';
import { Button, FlexRow } from "@epam/promo";
import orderBy from "lodash.orderby";

interface IItemsState {
    shownChildren: JSX.Element[];
    hiddenChildren: JSX.Element[];
}

const buttons = [
    { id: 1, title: 'Some Preset', priority: 99 },
    { id: 2, title: 'Administrators', priority: 4 },
    { id: 3, title: 'Only age more 40', priority: 1 },
    { id: 4, title: 'Managers', priority: 2 },
    // { id: 5, title: 'Only active', priority: 1 },
    // { id: 6, title: 'Financial', priority: 3 },
    // { id: 7, title: 'Married', priority: 5 },
];

const getTempButton = (caption: string = 'Test Button', priority: number = 0) => {
    const tempPriority = priority || Math.ceil(Math.random() * 90);
    return <Button
        rawProps={ { style: { flexShrink: "0", minWidth: 'initial' } } }
        key={ Math.random() }
        data-priority={ tempPriority }
        caption={ `${ tempPriority } ${ caption }` }
        color="blue"
        onClick={ () => {
        } }
    />;
};

const buttonsArray = buttons.map((button) => (
    <Button
        rawProps={ { style: { flexShrink: "0", minWidth: 'initial' } } }
        key={ button.id }
        data-priority={ button.priority }
        caption={ `${ button.priority }-${ button.title }` }
        color="blue"
        onClick={ () => {
        } }
    />
));

const itemsByPriority = (items: JSX.Element[]) => orderBy(items, item => item.props["data-priority"], 'desc');

export const AdoptivePanel = () => {
    const addNewHandler = () => {
        const tempButton = getTempButton();
        setSortedItems((prevState) => ({ shownChildren: [...prevState.shownChildren, tempButton], hiddenChildren: [...prevState.hiddenChildren] }));
    };

    const addNewButtonEl = <Button
        rawProps={ { style: { flexShrink: "0", minWidth: 'initial' } } }
        key={ Math.random() }
        data-priority={ 100 }
        caption={ `+ Add New` }
        color="blue"
        onClick={ addNewHandler }
    />;

    const [changeState, setChangeState] = useState(false);
    const [sortedItems, setSortedItems] = useState<IItemsState>({ shownChildren: [addNewButtonEl, ...buttonsArray], hiddenChildren: [] });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const adoptiveRowRef = useRef<HTMLDivElement>(null);
    const hiddenRowRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef(null);
    // const spacing = "6";

    // const resizeHandler = () => {
    //     const sortedByPriorityItems = itemsByPriority([...sortedItems.shownChildren, ...sortedItems.hiddenChildren]);
    //     console.log('tempItems', sortedByPriorityItems);
    //
    //     const wrapperWidth = wrapperRef?.current ? Math.ceil(wrapperRef.current.getBoundingClientRect().width) : 0;
    //
    //     // if (adoptiveRowRef.current.getBoundingClientRect().width < wrapperWidth) {
    //     //     setSortedItems(() => ({ shownChildren: sortedByPriorityItems, hiddenChildren: [] }));
    //     //     return;
    //     // }
    //
    //     console.log('wrapperWidth', wrapperWidth);
    //     let sumChildrenWidth = 0;
    //
    //     const children = Array.from(adoptiveRowRef.current.children);
    //     console.log('children', children);
    //
    //     if (children.length) {
    //         setSortedItems(() => ({ shownChildren: [], hiddenChildren: [] }));
    //     } else {
    //         return;
    //     }
    //
    //     children.length && children.forEach((item, index) => {
    //         const itemWidth = Math.ceil(item.getBoundingClientRect().width) + +spacing;
    //         console.log('itemWidth', itemWidth);
    //         if (sumChildrenWidth + itemWidth < wrapperWidth) {
    //             sumChildrenWidth += itemWidth;
    //             setSortedItems((i) => ({ shownChildren: [...i.shownChildren, sortedByPriorityItems[index]], hiddenChildren: [...i.hiddenChildren] }));
    //         } else {
    //             setSortedItems((i) => ({ shownChildren: [...i.shownChildren], hiddenChildren: [...i.hiddenChildren, sortedByPriorityItems[index]] }));
    //         }
    //         console.log('sumChildrenWidth', sumChildrenWidth);
    //     });
    // };

    const sortElements = () => {
        console.log('sortedItems', sortedItems);

        let sumChildrenWidth = 0;
        const wrapperWidth = wrapperRef?.current ? Math.ceil(wrapperRef.current.getBoundingClientRect().width) : 0;
        // console.log('wrapperWidth', wrapperWidth);

        const allChildren = [...Array.from(adoptiveRowRef.current.children), ...Array.from(hiddenRowRef.current.children)];
        console.log('allChildren.length', allChildren.length);

        if (!allChildren.length) return;

        const tempAllItems = sortedItems.shownChildren.concat(sortedItems.hiddenChildren);
        console.log('tempAllItems', tempAllItems);

        const itemsWidth = allChildren.map(child => Math.ceil(child.getBoundingClientRect().width));
        // console.log('itemsWidth', itemsWidth);

        const tempSortedItems: IItemsState = { shownChildren: [], hiddenChildren: [] };

        tempAllItems.forEach((item, index) => {
            if (sumChildrenWidth + itemsWidth[index] < wrapperWidth) {
                sumChildrenWidth += itemsWidth[index];
                tempSortedItems.shownChildren.push(tempAllItems[index]);
            } else {
                tempSortedItems.hiddenChildren.push(tempAllItems[index]);
            }
        });

        console.log('tempSortedItems', tempSortedItems);
        setSortedItems(() => tempSortedItems);
    };

    useLayoutEffect(() => {
        sortElements();
        // requestRef.current = requestAnimationFrame(sortElements);
        // return () => {
        //     cancelAnimationFrame(requestRef.current);
        // };
    }, [changeState]);

    useEffect(() => {
        // const resizeObserver = new ResizeObserver(sortElements);
        const resizeObserver = new ResizeObserver(() => setChangeState(prev => !prev));

        resizeObserver.observe(adoptiveRowRef.current);
        resizeObserver.observe(wrapperRef.current);
        return () => {
            resizeObserver.unobserve(adoptiveRowRef.current);
            resizeObserver.unobserve(wrapperRef.current);
        };
    }, []);

    return (
        <div className={ css.mainWrapper } ref={ wrapperRef }>
            <h1>Shown Children</h1>
            <FlexRow cx={ css.adoptiveRow } background="gray5" ref={ adoptiveRowRef }>
                { sortedItems.shownChildren }
            </FlexRow>
            <h1>Hidden Children</h1>
            <FlexRow background="gray5" ref={ hiddenRowRef }>
                { sortedItems.hiddenChildren }
            </FlexRow>
        </div>
    );
};