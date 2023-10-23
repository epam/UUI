import * as React from 'react';
import { FlexRow } from '@epam/uui';

import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';
import { ReactComponent as ColorIcon } from '../icons/text-color-select.svg';

import { ToolbarButton } from './ToolbarButton';

type IColorBar = {
    updateColor: (color: string) => void;
    clearColor: () => void;
    value?: string,
};

export function ColorBar({ updateColor, clearColor, value }: IColorBar) {
    return (
        <FlexRow rawProps={ { style: { border: '1px solid var(--uui-divider-light)' } } }>
            <ToolbarButton
                onClick={ clearColor }
                isActive={ false }
                icon={ ClearIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('var(--uui-critical-50)') }
                iconColor="red"
                isActive={ value === 'var(--uui-critical-50)' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('var(--uui-warning-50)') }
                iconColor="amber"
                isActive={ value === 'var(--uui-warning-50)' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('var(--uui-text-success)') }
                iconColor="green"
                isActive={ value === 'var(--uui-text-success)' }
                icon={ ColorIcon }
            />
        </FlexRow>
    );
}
