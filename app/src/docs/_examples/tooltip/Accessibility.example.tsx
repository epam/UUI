import React from 'react';
import { Button, Tooltip } from '@epam/uui';
import { ReactComponent as copyIcon } from '@epam/assets/icons/common/content-link-18.svg';
import css from './TypesExample.module.scss';

export default function AccessibilityTooltipExample() {
    return (
        <Tooltip
            content="Copy to clipboard"
            rawProps={ { id: 'copyTooltip' } }
        >
            <Button
                rawProps={ {
                    'aria-describedby': 'copyTooltip',
                    'aria-description': 'Copy to clipboard',
                } }
                icon={ copyIcon }
                caption="Copy"
                fill="outline"
                color="primary"
                cx={ css.firstColumn }
                onClick={ () => null }
            />
        </Tooltip>
    );
}
