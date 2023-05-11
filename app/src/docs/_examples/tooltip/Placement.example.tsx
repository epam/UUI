import React from 'react';
import { Button, Tooltip } from '@epam/promo';
import css from './PlacementExample.scss';

export default function PlacementTooltipExample() {
    return (
        <div className={ css.placementContainer }>
            <Tooltip content="Tooltip message" placement="top-start">
                <Button caption="TL" fill="white" color="gray" onClick={ () => null } cx={ css['top-start'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="top">
                <Button caption="Top" fill="white" color="gray" onClick={ () => null } cx={ css.top } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="top-end">
                <Button caption="TR" fill="white" color="gray" onClick={ () => null } cx={ css['top-end'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="left-start">
                <Button caption="LT" fill="white" color="gray" onClick={ () => null } cx={ css['left-start'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="left">
                <Button caption="Left" fill="white" color="gray" onClick={ () => null } cx={ css.left } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="left-end">
                <Button caption="LB" fill="white" color="gray" onClick={ () => null } cx={ css['left-end'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="right-start">
                <Button caption="RT" fill="white" color="gray" onClick={ () => null } cx={ css['right-start'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="right">
                <Button caption="Right" fill="white" color="gray" onClick={ () => null } cx={ css.right } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="right-end">
                <Button caption="RB" fill="white" color="gray" onClick={ () => null } cx={ css['right-end'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="bottom-start">
                <Button caption="BL" fill="white" color="gray" onClick={ () => null } cx={ css['bottom-start'] } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="bottom">
                <Button caption="Bottom" fill="white" color="gray" onClick={ () => null } cx={ css.bottom } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="bottom-end">
                <Button caption="BR" fill="white" color="gray" onClick={ () => null } cx={ css['bottom-end'] } />
            </Tooltip>
        </div>
    );
}
