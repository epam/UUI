import React from 'react';
import { Button, Tooltip } from '@epam/promo';
import { Placement } from '@popperjs/core';
import css from './PlacementExample.scss';

interface IButton {
    name: string;
    placement: Placement;
}

export default function PlacementTooltipExample() {
    const buttonList: IButton[] = [
        {name: 'TL', placement: "top-start"},
        {name: 'Top', placement: "top"},
        {name: 'TR', placement: "top-end"},
        {name: 'LT', placement: "left-start"},
        {name: 'Left', placement: "left"},
        {name: 'LB', placement: "left-end"},
        {name: 'RT', placement: "right-start"},
        {name: 'Right', placement: "right"},
        {name: 'RB', placement: "right-end"},
        {name: 'BL', placement: "bottom-start"},
        {name: 'Bottom', placement: "bottom"},
        {name: 'BR', placement: "bottom-end"},
    ];

    return (
        <div className={ css.placementContainer }>
            { buttonList.map((button) => (
                <Tooltip key={ button.name } content='Tooltip message' placement={ button.placement } >
                    <Button caption={ button.name } fill='white' color='gray50' onClick={ () => null } cx={ css[button.placement] } />
                </Tooltip>
            )) }
        </div>
    );
}