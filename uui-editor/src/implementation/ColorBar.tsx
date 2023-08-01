import { uuiSkin } from '@epam/uui-core';
import * as React from 'react';

import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';
import { ReactComponent as ColorIcon } from '../icons/text-color-select.svg';

import { ToolbarButton } from './ToolbarButton';

const { FlexRow } = uuiSkin;

type IColorBar = {
    updateColor: (color: string) => void;
    clearColor: () => void;
    value?: string,
};

export function ColorBar({ updateColor, clearColor, value }: IColorBar) {
    return (
        <FlexRow rawProps={ { style: { background: '#303240' } } }>
            <ToolbarButton
                onClick={ clearColor }
                isActive={ false }
                icon={ ClearIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('#A72014') }
                iconColor="red"
                isActive={ value === '#A72014' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('#995A00') }
                iconColor="amber"
                isActive={ value === '#995A00' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                onClick={ () => updateColor('#669900') }
                iconColor="green"
                isActive={ value === '#669900' }
                icon={ ColorIcon }
            />
        </FlexRow>
    );
}
