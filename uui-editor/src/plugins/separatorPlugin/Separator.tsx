import React from 'react';
import cx from 'classnames';
import { useSelected } from 'slate-react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { uuiMod } from '@epam/uui-core';

import css from './Separator.module.scss';

const Separator = React.forwardRef<React.ElementRef<typeof PlateElement>, PlateElementProps>(({ className, ...props }, ref) => {
    const { children } = props;

    const selected = useSelected();

    return (
        <PlateElement ref={ ref } { ...props }>
            <div
                contentEditable={ false }
                className={ cx(css.separator, selected && uuiMod.focus) }
            >
            </div>
            { children }
        </PlateElement>
    );
});

export { Separator };
