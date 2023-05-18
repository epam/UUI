import React from 'react';
import { Button, Text, Tooltip } from '@epam/promo';
import { cx } from '@epam/uui-core';
import css from './TypesExample.module.scss';

export default function VariantsTooltipExample() {
    return (
        <div className={ css.container }>
            <Tooltip content="Tooltip message" placement="bottom">
                <Button caption="Contrast" color="blue" onClick={ () => null } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="bottom" color="white">
                <Button caption="Default" fill="white" color="gray" onClick={ () => null } />
            </Tooltip>

            <Tooltip content="Tooltip message" placement="bottom" color="red">
                <Button caption="Critical" fill="white" color="red" onClick={ () => null } />
            </Tooltip>

            <Text fontSize="14" cx={ cx(css.secondColumn, css.text) }>
                It has a perfect contrast ration, easily attracts attention.
                <br />
                Advices that can be used for any type of hint, that is considered important to inform (usually covers most cases).
            </Text>
            <Text fontSize="14" cx={ cx(css.secondColumn, css.text) }>
                Has less visibility. Can be used when we don’t want to annoy, especially when trigger actions place close to each other, and may be triggered
                accidentally.
            </Text>
            <Text fontSize="14" cx={ cx(css.secondColumn, css.text) }>
                Uses to deliver any critical, error or validation messages for table cells, forms, etc.
            </Text>
        </div>
    );
}
