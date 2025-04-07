import React from 'react';
import cx from 'classnames';
import { useSelected } from 'slate-react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { uuiMod } from '@epam/uui-core';

import css from './Separator.module.scss';

interface SeparatorProps extends PlateElementProps, React.RefAttributes<React.ElementRef<typeof PlateElement>> {}

function Separator({ className, ...props }: SeparatorProps) {
    const { children } = props;

    const selected = useSelected();

    return (
        <PlateElement ref={ props.ref } { ...props }>
            <div
                contentEditable={ false }
                className={ cx(css.separator, selected && uuiMod.focus) }
            >
            </div>
            { children }
        </PlateElement>
    );
}

export { Separator };
