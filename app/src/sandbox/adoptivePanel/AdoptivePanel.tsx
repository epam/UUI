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

// const itemsByPriority = (items: JSX.Element[]) => orderBy(items, item => item.props["data-priority"], 'desc');

export const AdoptivePanel = () => {
    const addNewHandler = () => {
        const tempButton = getTempButton();
        setSortedItems((prevState) => ({ shownChildren: [...prevState.shownChildren, tempButton], hiddenChildren: [...prevState.hiddenChildren] }));
        // setChangeState(prev => !prev);
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
    const shownRowRef = useRef<HTMLDivElement>(null);
    const hiddenRowRef = useRef<HTMLDivElement>(null);
    // const spacing = "6";

    console.log('changeState', changeState);


    const sortElements = () => {
        //150 это я поставил ширину селекта
        let sumChildrenWidth = sortedItems.hiddenChildren.length ? 150 : 0;
        const wrapperWidth = wrapperRef?.current ? Math.ceil(wrapperRef.current.getBoundingClientRect().width) : 0;
        const allChildren = [...Array.from(shownRowRef.current.children), ...Array.from(hiddenRowRef.current.children)];

        if (!allChildren.length) return;

        const tempAllItems = [...sortedItems.shownChildren, ...sortedItems.hiddenChildren];
        const itemsWidthArray = allChildren.map(child => Math.ceil(child.getBoundingClientRect().width));
        const tempSortedItems: IItemsState = { shownChildren: [], hiddenChildren: [] };

        tempAllItems.forEach((item, index) => {
            if (sumChildrenWidth + itemsWidthArray[index] < wrapperWidth) {
                sumChildrenWidth += itemsWidthArray[index];
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
    }, [changeState]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => setChangeState(prev => !prev));

        resizeObserver.observe(shownRowRef.current);
        resizeObserver.observe(wrapperRef.current);
        return () => {
            resizeObserver.unobserve(shownRowRef.current);
            resizeObserver.unobserve(wrapperRef.current);
        };
    }, []);

    return (
        <div className={ css.mainWrapper } ref={ wrapperRef }>
            <h1>Shown Children</h1>
            <FlexRow cx={ css.adoptiveRow } background="gray5" ref={ shownRowRef }>
                { sortedItems.shownChildren }
                { !!sortedItems.hiddenChildren.length && <select name="shownItemsSelect" style={ { display: "block", minWidth: '150px' } }>
                    { [<option hidden selected>More</option>, ...sortedItems.hiddenChildren.map((i, index) => <option value={ i.props.caption }>{ i.props.caption }</option>)] }
                </select> }
            </FlexRow>
            <h1>Hidden Children</h1>
            <FlexRow background="gray5" ref={ hiddenRowRef }>
                { sortedItems.hiddenChildren }
            </FlexRow>
        </div>
    );
};