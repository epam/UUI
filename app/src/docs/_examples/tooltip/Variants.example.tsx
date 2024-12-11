import React from 'react';
import { Button, Text, Tooltip } from '@epam/uui';
import { cx } from '@epam/uui-core';
import css from './TypesExample.module.scss';

export default function VariantsTooltipExample() {
    return (
        <div className={ css.container }>
            <Tooltip content="Tooltip message" color="inverted">
                <Button caption="Default" fill="outline" color="secondary" onClick={ () => null } />
            </Tooltip>

            <Tooltip content="Tooltip message" color="neutral">
                <Button caption="Contrast" color="primary" onClick={ () => null } />
            </Tooltip>

            <Tooltip content="Tooltip message" color="critical">
                <Button caption="Critical" fill="outline" color="critical" onClick={ () => null } />
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
