import css from "./UseAdoptivePanel.scss";
import React, { useRef } from "react";
import { Button, FlexRow } from "@epam/promo";
import { UseAdoptivePanel } from "./UseAdoptivePanel";


const buttons = [
    { id: 1, title: 'Default filter', priority: 100 },
    { id: 2, title: 'Administrators', priority: 4 },
    { id: 3, title: 'Only age more 40', priority: 1 },
    { id: 4, title: 'Managers', priority: 2 },
    { id: 5, title: 'Only active', priority: 1 },
    { id: 6, title: 'Financial', priority: 3 },
    { id: 7, title: 'Married', priority: 5 },
    { id: 8, title: 'Add New Preset', priority: 100 },
];

const buttonsArray = buttons.map((button) => (
    <Button key={ button.id } data-priority={ button.priority } caption={ `${ button.priority }-${ button.title }` } color="blue" onClick={ () => {} }/>
));

export const AdoptivePanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spacing = "6";

    const { portal, shownChildren, hiddenChildren } = UseAdoptivePanel(buttonsArray, containerRef, +spacing);

    return (
        <div className={ css.mainWrapper } style={ { width: '100%', border: '3px solid lightgreen' } }>
            <h1>ShownChildren</h1>
            <FlexRow background="gray5" ref={ containerRef } spacing={ spacing }>
                { shownChildren }
            </FlexRow>
            <h1>HiddenChildren</h1>
            <FlexRow background="gray5" spacing={ spacing }>
                { hiddenChildren }
            </FlexRow>
            { portal }
        </div>
    );
};