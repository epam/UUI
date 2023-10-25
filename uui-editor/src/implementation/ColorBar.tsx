import * as React from 'react';
import { FlexRow } from '@epam/uui';
import { ToolbarButton } from './ToolbarButton';

import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';
import { ReactComponent as ColorIcon } from '../icons/text-color-select.svg';

import css from './ColorBar.module.scss';

type IColorBar = {
    updateColor: (color: string) => void;
    clearColor: () => void;
    value?: string,
};

export function ColorBar({ updateColor, clearColor, value }: IColorBar) {
    return (
        <FlexRow cx={ css.wrapper }>
            <ToolbarButton
                onClick={ clearColor }
                isActive={ false }
                icon={ ClearIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('critical') }
                iconColor="red"
                isActive={ value === 'critical' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('warning') }
                iconColor="amber"
                isActive={ value === 'warning' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('success') }
                iconColor="green"
                isActive={ value === 'success' }
                icon={ ColorIcon }
            />
        </FlexRow>
    );
}
