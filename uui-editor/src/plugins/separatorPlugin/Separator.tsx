import React from 'react';
import cx from 'classnames';
import { useSelected } from 'slate-react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { uuiMod } from '@epam/uui-core';

import css from './Separator.module.scss';

const Separator = function SeparatorComponent({ className, ...props }: PlateElementProps) {
    const selected = useSelected();

    return (
        <PlateElement
            as="div"
            { ...props }
            contentEditable={ false }
            className={ cx(css.separator, selected && uuiMod.focus) }
        />
    );
};

export { Separator };
