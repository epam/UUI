import * as React from 'react';
import { uuiSkin } from '@epam/uui-core';
import { ToolbarButton as PlateToolbarButton } from '@udecode/plate-ui';

import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as ColorIcon } from '../icons/text-color-select.svg';

import { ToolbarButton } from './ToolbarButton';

const { FlexRow } = uuiSkin;

const noop = () => {};

type IColorBar = {
    updateColor: (color: string) => void;
    clearColor: () => void;
    value?: string,
};

export function ColorBar({ updateColor, clearColor, value }: IColorBar) {

    return <FlexRow rawProps={ { style: { background: '#303240' } } }>
        <PlateToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            icon={ <ToolbarButton
                onClick={ noop }
                isActive={ false }
                icon={ ClearIcon }
            /> }
            onMouseDown={ clearColor }
        />
        <PlateToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            icon={ <ToolbarButton
                onClick={ noop }
                iconColor='red'
                isActive={ value === '#A72014' }
                icon={ ColorIcon }
            /> }
            onMouseDown={ () => updateColor('#A72014') }
        />
        <PlateToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            icon={ <ToolbarButton
                onClick={ noop }
                iconColor='amber'
                isActive={ value === '#995A00' }
                icon={ ColorIcon }
            /> }
            onMouseDown={ () => updateColor('#995A00') }
        />
        <PlateToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            icon={ <ToolbarButton
                onClick={ noop }
                iconColor='green'
                isActive={ value === '#669900' }
                icon={ ColorIcon }
            /> }
            onMouseDown={ () => updateColor('#669900') }
        />
    </FlexRow>;
}